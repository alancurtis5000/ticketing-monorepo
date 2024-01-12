// this is the fake / mocked version of nats-wrapper for testing
// using  jest.fn() with .mockImplementation, allows you to mock the function for tests
// but also chect the values it was called with
export const natsWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          {
            callback();
          }
        }
      ),
  },
};
