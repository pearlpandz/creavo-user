// get dynamic placeholder image based resized width and height
export function updateImageUrl(url, newWidth, newHeight) {
  return url
    .replace(/w=\d+/, `w=${newWidth}`)
    .replace(/h=\d+/, `h=${newHeight}`);
}

export function dataURLtoFile(dataUrl, filename) {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]); // decode base64
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

export function getCrop(image, size, clipPosition = "center-middle") {
  const width = size.width;
  const height = size.height;
  const aspectRatio = width / height;

  let newWidth;
  let newHeight;

  const imageRatio = image.width / image.height;

  if (aspectRatio >= imageRatio) {
    newWidth = image.width;
    newHeight = image.width / aspectRatio;
  } else {
    newWidth = image.height * aspectRatio;
    newHeight = image.height;
  }

  let x = 0;
  let y = 0;
  if (clipPosition === "left-top") {
    x = 0;
    y = 0;
  } else if (clipPosition === "left-middle") {
    x = 0;
    y = (image.height - newHeight) / 2;
  } else if (clipPosition === "left-bottom") {
    x = 0;
    y = image.height - newHeight;
  } else if (clipPosition === "center-top") {
    x = (image.width - newWidth) / 2;
    y = 0;
  } else if (clipPosition === "center-middle") {
    x = (image.width - newWidth) / 2;
    y = (image.height - newHeight) / 2;
  } else if (clipPosition === "center-bottom") {
    x = (image.width - newWidth) / 2;
    y = image.height - newHeight;
  } else if (clipPosition === "right-top") {
    x = image.width - newWidth;
    y = 0;
  } else if (clipPosition === "right-middle") {
    x = image.width - newWidth;
    y = (image.height - newHeight) / 2;
  } else if (clipPosition === "right-bottom") {
    x = image.width - newWidth;
    y = image.height - newHeight;
  }

  return {
    cropX: x,
    cropY: y,
    cropWidth: newWidth,
    cropHeight: newHeight,
  };
}

// Responsive: show max 40 chars for description on mobile
export const getShortDescription = (short_description, limit = 40) => {
  const desc = short_description || "Explore our collection of media.";
  if (window.innerWidth <= 600 && desc.length > limit) {
    return desc.slice(0, limit) + "...";
  }
  return desc;
};

export const formatArrayWithPipe = (arr) => {
  if (!Array.isArray(arr)) {
    return "";
  }
  return arr.filter((item) => item).join(" | ");
};