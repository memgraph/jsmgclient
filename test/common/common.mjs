export async function cleanUp(mgClient, mg) {
  await mgClient.execute("MATCH (n) DETACH DELETE n");
  await mgClient.discardAll();
  mgClient.destroySession();
  mg.finalize();
}
