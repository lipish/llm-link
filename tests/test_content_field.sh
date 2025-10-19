#!/bin/bash

# 测试 content 字段的转换

echo "🧪 Testing Content Field Conversion"
echo "===================================="
echo ""

# 创建一个测试 Rust 程序
cat > /tmp/test_content.rs << 'EOF'
use serde_json::{json, Value};

fn main() {
    // 模拟 Zhipu 返回的响应（XML 在 content 字段中）
    let mut response = json!({
        "id": "chatcmpl-123",
        "object": "chat.completion",
        "created": 1234567890,
        "model": "glm-4-flash",
        "choices": [{
            "index": 0,
            "message": {
                "role": "assistant",
                "content": "<function_call>\n  {\"name\": \"shell\", \"arguments\": \"{\\\"command\\\": \\\"pwd && ls -la\\\"}\"}\n</function_call>"
            },
            "finish_reason": "stop"
        }]
    });

    println!("原始响应:");
    println!("{}", serde_json::to_string_pretty(&response).unwrap());
    println!("");

    // 模拟转换
    let content = response["choices"][0]["message"]["content"].as_str().unwrap();
    println!("Content 字段内容:");
    println!("{}", content);
    println!("");

    // 检查是否包含 XML
    if content.trim().starts_with('<') && content.contains("<function_call") {
        println!("✅ 检测到 XML");
        
        // 提取 XML 标签内的内容
        if let Some(start) = content.find('>') {
            if let Some(end) = content.rfind('<') {
                let inner = &content[start + 1..end].trim();
                println!("XML 内部内容: {}", inner);
                
                // 尝试解析为 JSON
                if let Ok(json_value) = serde_json::from_str::<Value>(inner) {
                    println!("✅ 成功解析为 JSON:");
                    println!("{}", serde_json::to_string_pretty(&json_value).unwrap());
                    
                    // 问题：我们应该把 content 替换为什么？
                    println!("");
                    println!("❓ 问题：Codex 期望的格式是什么？");
                    println!("");
                    println!("选项 1: 替换为 JSON 对象");
                    response["choices"][0]["message"]["content"] = json_value.clone();
                    println!("{}", serde_json::to_string_pretty(&response).unwrap());
                    println!("");
                    
                    println!("选项 2: 替换为 JSON 字符串");
                    response["choices"][0]["message"]["content"] = Value::String(serde_json::to_string(&json_value).unwrap());
                    println!("{}", serde_json::to_string_pretty(&response).unwrap());
                    println!("");
                    
                    println!("选项 3: 使用 function_call 字段");
                    response["choices"][0]["message"]["function_call"] = json_value.clone();
                    response["choices"][0]["message"]["content"] = Value::Null;
                    println!("{}", serde_json::to_string_pretty(&response).unwrap());
                }
            }
        }
    }
}
EOF

# 编译并运行
echo "编译测试程序..."
rustc /tmp/test_content.rs -o /tmp/test_content 2>&1 | head -20

if [ -f /tmp/test_content ]; then
    echo "✅ 编译成功"
    echo ""
    echo "运行测试..."
    echo "===================================="
    /tmp/test_content
    rm /tmp/test_content
else
    echo "❌ 编译失败"
fi

rm /tmp/test_content.rs

