export function generateRoomCode(): string {
  let randomChars = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
  var result = [];
  for (var i = 0; i < 6; i++) {
    result.push(
      randomChars.charAt(Math.floor(Math.random() * randomChars.length)),
    );
  }
  return result.join("");
}
