// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.

export { assertEquals } from "https://deno.land/std@0.197.0/assert/assert_equals.ts";
export { assertRejects } from "https://deno.land/std@0.197.0/assert/assert_rejects.ts";
export { createGraph } from "https://deno.land/x/deno_graph@0.66.0/mod.ts";

export async function withTempDir(
  action: (path: string) => Promise<void> | void,
) {
  const tempDir = Deno.makeTempDirSync();
  try {
    await action(tempDir);
  } finally {
    Deno.removeSync(tempDir, { recursive: true });
  }
}
