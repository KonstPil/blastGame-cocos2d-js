let folder = 'images/';

let res = {
  FIELD_IMAGE: folder + "field.png",
  BTILE_IMAGE: folder + "blue-tile.png",
  GTILE_IMAGE: folder + "green-tile.png",
  PTILE_IMAGE: folder + "purple-tile.png",
  RTILE_IMAGE: folder + "red-tile.png",
  YTILE_IMAGE: folder + "yellow-tile.png",
  PROGRESS_IMAGE: folder + 'progress-bar.png',
  STEPS_IMAGE: folder + 'steps.png',
  ONEBAR_IMAGE: folder + 'one-bar.png'
};

let g_resources = [];
for (let i in res) {
  g_resources.push(res[i]);
}