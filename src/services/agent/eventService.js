import agentApi from "@/lib/axios/agent";

// =========================================================
// event create functions
// =========================================================
export const createEvent = async (data) => {
  const response = await agentApi.post("/event/create", data);

  return response.data;
};

// =========================================================
// event patch data functions
// =========================================================
export const patchEvent = async (id, data) => {
  const response = await agentApi.patch(`/event/patch/${id}`, data);

  return response.data;
};

// =========================================================
// event patch shcedule functions
// =========================================================
export const patchEventSchedule = async (id, data) => {
  const response = await agentApi.patch(`/event/schedule/${id}`, data);

  return response.data;
};

// =========================================================
// event patch location functions
// =========================================================
export const patchEventLocation = async (id, data) => {
  const response = await agentApi.patch(`/event/location/${id}`, data);

  return response.data;
};

// =========================================================
// event create media
// =========================================================
export const createEventMedia = async (id, data) => {
  const response = await agentApi.post(`/event/media/${id}`, data);

  return response.data;
};

// =========================================================
// event delete media functions
// =========================================================
export const deleteEventMedia = async (id, mediaId) => {
  const response = await agentApi.delete(
    `/event/media/${id}?media_id=${mediaId}`,
  );

  return response.data;
};

// =========================================================
// event loading functions
// =========================================================
export const loadEvent = async ({ limit, offset, ordering, search } = {}) => {
  const params = new URLSearchParams();

  if (limit) params.append("limit", limit);
  if (offset !== null && offset !== undefined) {
    params.append("offset", offset);
  }
  if (ordering) params.append("ordering", ordering);
  if (search) params.append("search", search);

  const response = await agentApi.get(`/event/list?${params.toString()}`);

  return response.data;
};

// =========================================================
// event short details
// =========================================================
export const loadEventShortDetails = async (id) => {
  const response = await agentApi.get(`/event/short-detail/${id}`);

  return response.data;
};

// =========================================================
// event full details
// =========================================================
export const loadEventFullDetails = async (id) => {
  const response = await agentApi.get(`/event/full-detail/${id}`);

  return response.data;
};

// =========================================================
// event schedule
// =========================================================
export const loadEventSchedule = async (id) => {
  const response = await agentApi.get(`/event/schedule/${id}`);

  return response.data;
};

// =========================================================
// event location
// =========================================================
export const loadEventLocation = async (id) => {
  const response = await agentApi.get(`/event/location/${id}`);

  return response.data;
};

// =========================================================
// event media
// =========================================================
export const loadEventMedia = async (id) => {
  const response = await agentApi.get(`/event/media/${id}`);

  return response.data;
};
