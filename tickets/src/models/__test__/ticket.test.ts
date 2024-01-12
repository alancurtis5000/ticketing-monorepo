import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async () => {
  // create an instance of a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 5,
    userId: "123",
  });
  // save the ticket to the database
  await ticket.save();
  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);
  // make two separate changes to the tickets we fetched
  firstInstance?.set({ price: 10 });
  secondInstance?.set({ price: 22 });
  // save the first fetched ticket
  await firstInstance?.save();
  // save the second fetched ticket and expect and error

  try {
    // little hack to test if error should be thrown
    await secondInstance?.save(); // make call in try catch
  } catch (error) {
    return; // when it fails
  }

  throw new Error("Should not reach this point"); // it should never reach here
});

it("should increment version number on multiple saves", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 5,
    userId: "123",
  });

  // save the ticket to the database
  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);
});
