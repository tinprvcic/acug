const CAMUNDA_ENDPOINT = "http://localhost:8080/engine-rest/";

const fetch_camunda = async (endpoint, options) => {
  const res = await fetch(
    CAMUNDA_ENDPOINT + endpoint,
    options?.post
      ? {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(options.data || {}),
        }
      : undefined
  );

  const json =
    res.headers.get("content-type") === "application/json"
      ? await res.json()
      : undefined;

  return json;
};

module.exports = class Camunda {
  static async createNarudzba() {
    const data = await fetch_camunda("process-definition/key/narudzba5/start", {
      post: true,
    });

    return { id: data.id, definitionId: data.definitionId };
  }

  static async getNextTask(cam_id) {
    const data = await fetch_camunda(`task?processInstanceId=${cam_id}`);

    return { id: data[0].id };
  }

  static async completeNextTask(cam_id, data) {
    const { id } = await this.getNextTask(cam_id);

    console.log("dat", id, data);

    await fetch_camunda(`task/${id}/complete`, { post: true, data });
  }

  static async sendAcceptOrderMessage(cam_id) {
    await fetch_camunda("message", {
      post: true,
      data: { messageName: "obavijest_narudzbe", processInstanceId: cam_id },
    });
  }
};
