module.export.getRandomColor = () => {
  var colorRGB = [0xFF, 0x07, (Math.random() * 256) >> 0]
  colorRGB.sort(() => {
      return 0.5 - Math.random();
  })
  return "#" + ((1 << 24) + (colorRGB[0] << 16) + (colorRGB[1] << 8) + colorRGB[2]).toString(16).slice(1);
}
