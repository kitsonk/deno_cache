export function read_file_bytes(path) {
  try {
    return Deno.readFileSync(path);
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return undefined;
    } else {
      throw err;
    }
  }
}

export function atomic_write_file(path, bytes) {
  // write to a temporary file write beside the other file, then rename it
  // in a single sys call in order to prevent issues where the process
  // is killed while writing to a file and the file ends up in a corrupted state

  const cachePerm = 0o644;
  const tempName = path + "." + randomHex();
  Deno.writeFileSync(tempName, bytes, { mode: cachePerm });
  try {
    Deno.renameSync(tempName, path);
  } catch (err) {
    try {
      Deno.removeSync(tempName);
    } catch {
      // ignore
    }
    throw err;
  }

  function randomHex() {
    //https://stackoverflow.com/a/27747377/188246
    const arr = new Uint8Array(10);
    crypto.getRandomValues(arr);
    return Array.from(arr, (dec) => dec.toString(16).padStart(2, "0")).join("");
  }
}

export function modified_time(path) {
  try {
    const stat = Deno.statSync(path);
    const msToS = 1000;
    return stat.mtime.getTime() * msToS;
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return undefined;
    } else {
      throw err;
    }
  }
}

export function is_file(path) {
  try {
    const stat = Deno.statSync(path);
    return stat.isFile;
  } catch {
    return false;
  }
}
