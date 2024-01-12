// this is the fake / mocked version of stripe for testing
// using  jest.fn() with .mockImplementation, allows you to mock the function for tests
// but also chect the values it was called with
export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({ id: "stripeId-123" }),
  },
};
