import { useState, ChangeEvent } from "react";

export default function ImageConverter() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [downloadLink, setDownloadLink] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [format, setFormat] = useState<string>("jpeg");
  const [quality, setQuality] = useState<number>(0.8); // 기본 품질 설정 (80%)

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setFileName(file.name.split(".")[0]);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertImageFormat = () => {
    if (!imageSrc) return;

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // toDataURL에 품질 설정 추가 (JPEG, WebP에만 적용됨)
        const dataUrl =
          format === "jpeg" || format === "webp"
            ? canvas.toDataURL(`image/${format}`, quality) // 품질 설정 적용
            : canvas.toDataURL(`image/${format}`);

        setDownloadLink(dataUrl);
      }
    };
  };

  return (
    <div>
      <input type="file" onChange={handleImageUpload} accept="image/*" />
      {imageSrc && (
        <>
          <div>
            <label>Select Format: </label>
            <select onChange={(e) => setFormat(e.target.value)} value={format}>
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
            </select>
          </div>

          {(format === "jpeg" || format === "webp") && (
            <div>
              <label>Quality (0.1 - 1.0): </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="1.0"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
              />
            </div>
          )}

          <button onClick={convertImageFormat}>Convert Image</button>
        </>
      )}

      {downloadLink && (
        <a href={downloadLink} download={`${fileName}.${format}`}>
          <button>Download Converted Image</button>
        </a>
      )}
    </div>
  );
}
