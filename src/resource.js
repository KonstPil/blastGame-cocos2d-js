res = {
  FIELD_IMAGE: "res/field.png",
  BTILE_IMAGE: "res/blue-tile.png",
  GTILE_IMAGE: "res/green-tile.png",
  PTILE_IMAGE: "res/purple-tile.png",
  RTILE_IMAGE: "res/red-tile.png",
  YTILE_IMAGE: "res/yellow-tile.png",
  BOMB_IMAGE: "res/bomb.png",
  PROGRESS_IMAGE: 'res/progress-bar.png',
  STEPS_IMAGE: 'res/steps.png',
  ONEBAR_IMAGE: 'res/one-bar.png'
};

g_resources = [];
for (let i in res) {
  g_resources.push(res[i]);
}