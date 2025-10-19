use serde_json::Value;
use tracing::{debug, warn};

/// 检测字符串是否包含 XML 格式的 function call
/// 
/// 检测规则：
/// 1. 检查是否以 `<` 开头（可能有空格）
/// 2. 检查是否包含常见的 function call XML 标签
pub fn contains_xml_function_call(content: &str) -> bool {
    let trimmed = content.trim();
    
    // 检查是否以 < 开头
    if !trimmed.starts_with('<') {
        return false;
    }
    
    // 检查是否包含常见的 function call 相关标签
    // 智谱 AI 可能使用的标签格式
    let xml_indicators = [
        "<tool_call",
        "<function_call",
        "<invoke",
        "<tool>",
        "<function>",
    ];
    
    xml_indicators.iter().any(|indicator| trimmed.contains(indicator))
}

/// 尝试将 XML 格式的 function call 转换为 JSON 格式
///
/// 这是一个简化的转换器，处理常见的 XML function call 格式
///
/// 支持两种格式：
/// 1. 纯 XML 格式：
/// ```xml
/// <tool_call>
///   <name>get_weather</name>
///   <arguments>
///     <location>Beijing</location>
///   </arguments>
/// </tool_call>
/// ```
///
/// 2. XML 包裹 JSON 格式：
/// ```xml
/// <function_call>
///   {"name": "shell", "arguments": "{\"command\": \"pwd\"}"}
/// </function_call>
/// ```
pub fn convert_xml_to_json_function_call(xml_content: &str) -> Result<Value, String> {
    debug!("🔄 Attempting to convert XML to JSON: {}", xml_content);

    let trimmed = xml_content.trim();

    // 首先尝试提取 XML 标签内的内容
    let inner_content = extract_xml_wrapped_content(trimmed)?;

    // 检查内容是否是 JSON
    if let Ok(json_value) = serde_json::from_str::<Value>(&inner_content) {
        debug!("✅ Detected JSON wrapped in XML tags, extracted: {}", json_value);
        return Ok(json_value);
    }

    // 如果不是 JSON，按照纯 XML 格式处理
    // 提取 function name
    let name = extract_xml_tag_content(trimmed, "name")
        .or_else(|| extract_xml_tag_content(trimmed, "function"))
        .or_else(|| extract_xml_tag_content(trimmed, "tool"))
        .ok_or_else(|| "Failed to extract function name from XML".to_string())?;

    // 提取 arguments
    let arguments_xml = extract_xml_tag_content(trimmed, "arguments")
        .or_else(|| extract_xml_tag_content(trimmed, "parameters"))
        .unwrap_or_default();

    // 解析 arguments 为 JSON object
    let arguments = if arguments_xml.is_empty() {
        serde_json::json!({})
    } else {
        parse_xml_arguments(&arguments_xml)?
    };

    let result = serde_json::json!({
        "name": name,
        "arguments": arguments
    });

    debug!("✅ Successfully converted XML to JSON: {}", result);
    Ok(result)
}

/// 提取 XML 标签包裹的内容
///
/// 例如: `<function_call>content</function_call>` -> `content`
fn extract_xml_wrapped_content(xml: &str) -> Result<String, String> {
    let trimmed = xml.trim();

    // 查找第一个 > 和最后一个 <
    let start = trimmed.find('>')
        .ok_or_else(|| "No opening tag found".to_string())?;
    let end = trimmed.rfind('<')
        .ok_or_else(|| "No closing tag found".to_string())?;

    if start >= end {
        return Err("Invalid XML structure".to_string());
    }

    Ok(trimmed[start + 1..end].trim().to_string())
}

/// 从 XML 中提取指定标签的内容
/// 
/// 例如: `<name>get_weather</name>` -> `Some("get_weather")`
fn extract_xml_tag_content(xml: &str, tag: &str) -> Option<String> {
    let start_tag = format!("<{}>", tag);
    let end_tag = format!("</{}>", tag);
    
    let start_pos = xml.find(&start_tag)?;
    let content_start = start_pos + start_tag.len();
    let end_pos = xml[content_start..].find(&end_tag)?;
    
    Some(xml[content_start..content_start + end_pos].trim().to_string())
}

/// 解析 XML arguments 为 JSON object
///
/// 支持简单的键值对格式:
/// ```xml
/// <location>Beijing</location>
/// <unit>celsius</unit>
/// ```
///
/// 转换为:
/// ```json
/// {
///   "location": "Beijing",
///   "unit": "celsius"
/// }
/// ```
fn parse_xml_arguments(xml: &str) -> Result<Value, String> {
    use regex::Regex;

    let mut args = serde_json::Map::new();

    // 匹配所有的 <key>value</key> 格式
    // 注意：Rust regex 不支持反向引用，所以我们使用简单的模式匹配
    let re = Regex::new(r"<([a-zA-Z_][a-zA-Z0-9_]*)>([^<]*)</([a-zA-Z_][a-zA-Z0-9_]*)>")
        .map_err(|e| format!("Regex error: {}", e))?;

    for cap in re.captures_iter(xml) {
        let open_tag = cap.get(1).map(|m| m.as_str()).unwrap_or("");
        let value = cap.get(2).map(|m| m.as_str()).unwrap_or("");
        let close_tag = cap.get(3).map(|m| m.as_str()).unwrap_or("");

        // 验证开始和结束标签是否匹配
        if open_tag != close_tag {
            continue; // 跳过不匹配的标签
        }

        // 尝试解析为数字或布尔值，否则作为字符串
        let json_value = if let Ok(num) = value.parse::<i64>() {
            Value::Number(num.into())
        } else if let Ok(num) = value.parse::<f64>() {
            Value::Number(serde_json::Number::from_f64(num).unwrap_or(0.into()))
        } else if value == "true" {
            Value::Bool(true)
        } else if value == "false" {
            Value::Bool(false)
        } else {
            Value::String(value.to_string())
        };

        args.insert(open_tag.to_string(), json_value);
    }

    Ok(Value::Object(args))
}

/// 在 JSON 响应中检测并转换 XML function calls
///
/// 这个函数会递归检查 JSON 对象中的所有字符串字段，
/// 如果发现 XML 格式的 function call，就转换为 JSON 格式
///
/// 特殊处理：如果在 message.content 中发现 function call，
/// 会将其移动到 message.function_call 字段（符合 OpenAI 规范）
pub fn transform_xml_in_json_response(data: &mut Value) -> bool {
    let mut transformed = false;

    match data {
        Value::Object(map) => {
            // 特殊处理：检查 message 对象中的 content 字段
            if let Some(content_value) = map.get("content") {
                if let Some(content_str) = content_value.as_str() {
                    if contains_xml_function_call(content_str) {
                        // 在 content 中发现 function call XML
                        match convert_xml_to_json_function_call(content_str) {
                            Ok(function_call_json) => {
                                // 移动到 function_call 字段
                                map.insert("function_call".to_string(), function_call_json);
                                // 清空 content
                                map.insert("content".to_string(), Value::Null);
                                transformed = true;
                                debug!("🔄 Moved XML function call from content to function_call field");
                            }
                            Err(e) => {
                                warn!("⚠️ Failed to convert XML in content field: {}", e);
                            }
                        }
                    }
                }
            }

            // 检查其他 function call 字段
            let function_call_fields = ["tool_calls", "function_call"];

            for field in &function_call_fields {
                if let Some(value) = map.get_mut(*field) {
                    if transform_xml_in_value(value) {
                        transformed = true;
                        debug!("🔄 Transformed XML in field: {}", field);
                    }
                }
            }

            // 递归处理嵌套对象
            for (_key, value) in map.iter_mut() {
                if transform_xml_in_json_response(value) {
                    transformed = true;
                }
            }
        }
        Value::Array(arr) => {
            for item in arr.iter_mut() {
                if transform_xml_in_json_response(item) {
                    transformed = true;
                }
            }
        }
        _ => {}
    }

    transformed
}

/// 转换单个 Value 中的 XML
fn transform_xml_in_value(value: &mut Value) -> bool {
    match value {
        Value::String(s) => {
            if contains_xml_function_call(s) {
                match convert_xml_to_json_function_call(s) {
                    Ok(json_value) => {
                        *value = json_value;
                        return true;
                    }
                    Err(e) => {
                        warn!("⚠️ Failed to convert XML to JSON: {}", e);
                    }
                }
            }
        }
        Value::Object(map) => {
            let mut transformed = false;
            for (_key, v) in map.iter_mut() {
                if transform_xml_in_value(v) {
                    transformed = true;
                }
            }
            return transformed;
        }
        Value::Array(arr) => {
            let mut transformed = false;
            for item in arr.iter_mut() {
                if transform_xml_in_value(item) {
                    transformed = true;
                }
            }
            return transformed;
        }
        _ => {}
    }
    
    false
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_contains_xml_function_call() {
        assert!(contains_xml_function_call("<tool_call><name>test</name></tool_call>"));
        assert!(contains_xml_function_call("  <function_call>...</function_call>"));
        assert!(!contains_xml_function_call("regular text"));
        assert!(!contains_xml_function_call("{\"name\": \"test\"}"));
    }

    #[test]
    fn test_extract_xml_tag_content() {
        let xml = "<name>get_weather</name>";
        assert_eq!(extract_xml_tag_content(xml, "name"), Some("get_weather".to_string()));
        
        let xml = "<arguments><location>Beijing</location></arguments>";
        assert_eq!(
            extract_xml_tag_content(xml, "arguments"),
            Some("<location>Beijing</location>".to_string())
        );
    }

    #[test]
    fn test_convert_xml_to_json_function_call() {
        let xml = r#"<tool_call>
            <name>get_weather</name>
            <arguments>
                <location>Beijing</location>
                <unit>celsius</unit>
            </arguments>
        </tool_call>"#;
        
        let result = convert_xml_to_json_function_call(xml).unwrap();
        assert_eq!(result["name"], "get_weather");
        assert_eq!(result["arguments"]["location"], "Beijing");
        assert_eq!(result["arguments"]["unit"], "celsius");
    }

    #[test]
    fn test_transform_xml_in_json_response() {
        let mut data = serde_json::json!({
            "content": "<tool_call><name>test</name><arguments><key>value</key></arguments></tool_call>"
        });

        let transformed = transform_xml_in_json_response(&mut data);
        assert!(transformed);
        assert_eq!(data["content"]["name"], "test");
        assert_eq!(data["content"]["arguments"]["key"], "value");
    }

    #[test]
    fn test_xml_wrapped_json() {
        // 测试 XML 包裹 JSON 的格式（Zhipu 实际返回的格式）
        let xml = r#"<function_call>
  {"name": "shell", "arguments": "{\"command\": \"pwd && ls -la\"}"}
</function_call>"#;

        let result = convert_xml_to_json_function_call(xml).unwrap();
        assert_eq!(result["name"], "shell");
        assert_eq!(result["arguments"], "{\"command\": \"pwd && ls -la\"}");
    }

    #[test]
    fn test_extract_xml_wrapped_content() {
        let xml = "<function_call>inner content</function_call>";
        let content = extract_xml_wrapped_content(xml).unwrap();
        assert_eq!(content, "inner content");

        let xml_multiline = r#"<function_call>
  {"key": "value"}
</function_call>"#;
        let content = extract_xml_wrapped_content(xml_multiline).unwrap();
        assert_eq!(content.trim(), r#"{"key": "value"}"#);
    }

    #[test]
    fn test_content_to_function_call() {
        // 测试将 content 中的 XML 移动到 function_call 字段
        let mut response = serde_json::json!({
            "id": "chatcmpl-123",
            "choices": [{
                "message": {
                    "role": "assistant",
                    "content": "<function_call>\n  {\"name\": \"shell\", \"arguments\": \"{\\\"command\\\": \\\"pwd\\\"}\"}\n</function_call>"
                }
            }]
        });

        let transformed = transform_xml_in_json_response(&mut response);
        assert!(transformed, "Should transform XML in content");

        // 验证 function_call 字段被创建
        let function_call = &response["choices"][0]["message"]["function_call"];
        assert!(function_call.is_object(), "function_call should be an object");
        assert_eq!(function_call["name"], "shell");

        // 验证 content 被清空
        let content = &response["choices"][0]["message"]["content"];
        assert!(content.is_null(), "content should be null after moving function_call");
    }
}

