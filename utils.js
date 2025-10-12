const { Image: NodeImage } = require("canvas");
const sharp = require("sharp");

const createNodeImage = async (src) => {
  return new Promise((resolve, reject) => {
    const image = new NodeImage();
    image.onload = () => {
      resolve(image);
    };
    image.onerror = (err) => {
      reject(err);
    };
    image.crossOrigin = "Anonymous";
    image.src = src;
  });
};

const getWebpBase64 = async (url) => {
  const coverImageBuffer = Buffer.from(
    await fetch(url).then((res) => res.arrayBuffer())
  );
  const sharpImage = sharp(coverImageBuffer);
  console.log(await sharpImage.metadata());
  return sharpImage
    .png()
    .toBuffer()
    .then((buffer) => "data:image/png;base64," + buffer.toString("base64"));
};

module.exports = {
  createNodeImage,
  getWebpBase64,
};
