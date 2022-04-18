export const appointmentBuilder = (builder) => ({
  getAppointment: builder.query({
    query: (appointmentId) => ({ url: `/${appointmentId}` }),
  }),
});
