"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lymph_client_1 = require("lymph-client");
const GreetingBuilder_1 = require("./GreetingBuilder");
const Simple_1 = require("./Simple");
const builder = new GreetingBuilder_1.default();
console.log(builder.build());
const person = { name: "joe", age: 20 };
console.log(lymph_client_1.Utils.merge(person, { age: 40 }));
const simple = new Simple_1.default("joe");
simple.printTo(console);
console.log(lymph_client_1.HTML);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIk1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQ0FBMEM7QUFFMUMsdURBQStDO0FBQy9DLHFDQUE2QjtBQUU3QixNQUFNLE9BQU8sR0FBRyxJQUFJLHlCQUFlLEVBQUUsQ0FBQTtBQUVyQyxPQUFPLENBQUMsR0FBRyxDQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBRSxDQUFBO0FBRTlCLE1BQU0sTUFBTSxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUE7QUFFdkMsT0FBTyxDQUFDLEdBQUcsQ0FBRSxvQkFBSyxDQUFDLEtBQUssQ0FBRSxNQUFNLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUUsQ0FBRSxDQUFBO0FBRWpELE1BQU0sTUFBTSxHQUFHLElBQUksZ0JBQU0sQ0FBRSxLQUFLLENBQUUsQ0FBQTtBQUVsQyxNQUFNLENBQUMsT0FBTyxDQUFFLE9BQU8sQ0FBRSxDQUFBO0FBRXpCLE9BQU8sQ0FBQyxHQUFHLENBQUUsbUJBQUksQ0FBRSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVXRpbHMsIEhUTUwgfSBmcm9tIFwibHltcGgtY2xpZW50XCJcblxuaW1wb3J0IEdyZWV0aW5nQnVpbGRlciBmcm9tIFwiLi9HcmVldGluZ0J1aWxkZXJcIlxuaW1wb3J0IFNpbXBsZSBmcm9tIFwiLi9TaW1wbGVcIlxuXG5jb25zdCBidWlsZGVyID0gbmV3IEdyZWV0aW5nQnVpbGRlcigpXG5cbmNvbnNvbGUubG9nKCBidWlsZGVyLmJ1aWxkKCkgKVxuXG5jb25zdCBwZXJzb24gPSB7IG5hbWU6IFwiam9lXCIsIGFnZTogMjAgfVxuXG5jb25zb2xlLmxvZyggVXRpbHMubWVyZ2UoIHBlcnNvbiwgeyBhZ2U6IDQwIH0gKSApXG5cbmNvbnN0IHNpbXBsZSA9IG5ldyBTaW1wbGUoIFwiam9lXCIgKVxuXG5zaW1wbGUucHJpbnRUbyggY29uc29sZSApXG5cbmNvbnNvbGUubG9nKCBIVE1MIClcbiJdfQ==