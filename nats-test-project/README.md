# nats-test-project
A test project for showing how to work with NATS
Terminal 1:
- get pods running
- go to skaffold directory
  - run `skaffold dev`
  - run `kubectl get pods`
  - find in the list the one named nats-depl-***
  - copy the podName and continue with port override

have to overide kube port with
give something access to kubenetes pod (strickly for dev purpose)
Terminal 2:
- kubectl port-forward nats-depl-6dddd89c77-d8tdr 4222:4222
- kubectl port-forward <podName> <localPort>:<podPort>

to see how many subcriptions are running
kubectl port-forward nats-depl-6dddd89c77-d8tdr 8222:8222
now you can goto http://localhost:8222/ and check on your service
http://localhost:8222/streaming

see how many subscribers there are
http://localhost:8222/streaming/channelsz?subs=1

Terminal 3: (can have multiple listeners)
run listener service.
`npm run listen`

Terminal 4:
run publish service.
`npm run publish`

then type rs in those terminals to restart them to republish and event

