import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import Router from "next/router";

import useRequest from "../../hooks/use-request";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push("/orders"),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const millesecondsLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(millesecondsLeft / 1000));
    };
    // invoke findTimeLeft so it starts right away
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  console.log({ order });

  if (timeLeft < 0) {
    return (
      <div>
        OrderShow
        <div> Time to purchase ticket has expired.</div>
      </div>
    );
  }
  return (
    <div>
      OrderShow
      <div> {timeLeft} seconds until order expires.</div>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        // stripeKey could be an env variable (inside of next.js)
        stripeKey="pk_test_51IIIXYFWmiyq6LwEcmhGkqlJLzr72EroFni6XdD8XVA9uQXNYhouPCcy4ukvSgkMGsFVjOlsR4BWxMSRsDuYBG8M00VHOVG4eL"
        amount={order.ticket.price * 100} // converts cents into dollars
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};
export default OrderShow;
