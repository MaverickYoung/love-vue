/**
 * Base64 图片保存到本地
 * @param base64String Base64 字符串
 * @param fileName 文件名
 */
export const saveBase64AsImage = (
  base64String: string,
  fileName: string,
): void => {
  // 匹配图片类型的正则表达式，支持 jpeg、png、gif 和 svg+xml
  const regex = /^data:image\/(jpeg|png|gif|svg\+xml);base64,/;

  // 确保Base64字符串格式正确，去除任何非Base64的前缀部分
  const match = base64String.match(regex);
  if (!match) {
    console.error('无效的 Base64 字符串格式。');
    return;
  }

  // 获取图片类型（jpeg、png、gif 或 svg+xml）
  const imageType = match[1];

  // 去除前缀部分，提取Base64编码数据
  const base64Data = base64String.replace(regex, '');

  try {
    // 解码Base64字符串
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    // 将解码后的字符转换为Uint8Array
    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const byteArray = [];
      for (
        let i = offset;
        i < Math.min(offset + 1024, byteCharacters.length);
        i++
      ) {
        byteArray.push(byteCharacters.charCodeAt(i));
      }
      byteArrays.push(new Uint8Array(byteArray));
    }

    // 创建Blob对象，设置正确的MIME类型
    const blob = new Blob(byteArrays, { type: `image/${imageType}` });

    // 创建下载链接并触发下载
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName; // 设置文件名
    link.click(); // 触发下载
  } catch (error) {
    console.error('解码 Base64 字符串时出错：', error);
  }
};
