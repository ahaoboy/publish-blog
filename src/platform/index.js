import oschina from "./oschina";

async function publishAll(path) {
  console.log("publishAll", path);
  return oschina(path);
}

export default publishAll;
