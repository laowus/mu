use crate::http_client::{http_get, parse_jsonp};
use std::result::Result;

#[tauri::command]
pub async fn fetch_qq_category() -> Result<String, String> {
    // 定义基础URL
    let url = "https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_tag_conf.fcg";

    // 定义查询参数
    let query = vec![
        ("format", "json"),
        ("inCharset", "utf-8"),
        ("outCharset", "utf-8"),
    ];

    let header = vec![
        ("Referer", "https://y.qq.com/"),
        ("Origin", "https://y.qq.com"),
        ("Content-Type", "application/x-www-form-urlencoded"),
    ];

    // 发送请求并获取结果
    let result = http_get(url, header, query).await?;

    // 如果响应是JSONP格式，进行解析
    if result.starts_with("callback(") {
        parse_jsonp(&result)
    } else {
        Ok(result)
    }
}
