"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Templates = require("./Templates");
describe("render", function () {
    test("function calls", function () {
        expect(Templates.render('@module("modules/home")', { dev: true }))
            .toEqual('<script type="module" src="modules/home"></script>');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVtcGxhdGVzLnRlc3RzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiVGVtcGxhdGVzLnRlc3RzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUNBQXdDO0FBRXhDLFFBQVEsQ0FBRSxRQUFRLEVBQUU7SUFDaEIsSUFBSSxDQUFFLGdCQUFnQixFQUFFO1FBQ3BCLE1BQU0sQ0FBRSxTQUFTLENBQUMsTUFBTSxDQUFFLHlCQUF5QixFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFFLENBQUU7YUFDakUsT0FBTyxDQUFFLG9EQUFvRCxDQUFFLENBQUE7SUFDeEUsQ0FBQyxDQUFFLENBQUE7QUFDUCxDQUFDLENBQUUsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFRlbXBsYXRlcyBmcm9tIFwiLi9UZW1wbGF0ZXNcIlxuXG5kZXNjcmliZSggXCJyZW5kZXJcIiwgZnVuY3Rpb24gKCkge1xuICAgIHRlc3QoIFwiZnVuY3Rpb24gY2FsbHNcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBleHBlY3QoIFRlbXBsYXRlcy5yZW5kZXIoICdAbW9kdWxlKFwibW9kdWxlcy9ob21lXCIpJywgeyBkZXY6IHRydWUgfSApIClcbiAgICAgICAgICAgIC50b0VxdWFsKCAnPHNjcmlwdCB0eXBlPVwibW9kdWxlXCIgc3JjPVwibW9kdWxlcy9ob21lXCI+PC9zY3JpcHQ+JyApXG4gICAgfSApXG59IClcbiJdfQ==