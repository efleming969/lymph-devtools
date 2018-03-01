"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FS = require("fs-extra");
const Path = require("path");
// import * as AWS from "aws-sdk"
// import * as Glob from "globby"
// import * as Mime from "mime"
const Scripts = require("./Scripts");
const Styles = require("./Styles");
const Templates = require("./Templates");
exports.configure = function (source, target) {
    return Promise.resolve({ source, target });
};
const mapToPromises = fn => list => Promise.all(list.map(fn));
const logit = it => console.log(it);
exports.buildTemplates = function (config) {
    return Templates.detect(config.source)
        .then(templates => templates.map(Templates.render))
        .then(templates => templates.map(Templates.write(config.target)))
        .then(() => config);
};
exports.buildScripts = function (config) {
    return Scripts.detect(config.source, config.target)
        .then(Scripts.compile)
        .then(Scripts.bundle)
        .then(() => config);
};
exports.buildStyles = function (config) {
    return Styles.detect(config.source, config.target)
        .then(Styles.compile)
        .then(() => config);
};
exports.buildStatics = function (config) {
    const source_dir = Path.join(config.source, "statics");
    const target_dir = Path.join(config.target, "statics");
    return FS.copy(source_dir, target_dir)
        .then(() => config);
};
// export const deploy = function ( source: string, target: string, region: string ) {
//     const s3 = new AWS.S3( { region } )
//
//     return Glob( source ).then( function ( files ) {
//         return Promise.all( files.map( function ( file ) {
//             return FS.readFile( file ).then( function ( buffer ) {
//                 const put_config = {
//                     Body: buffer,
//                     Bucket: target,
//                     Key: file.replace( source + "/", "" ),
//                     ContentType: Mime.getType( file ) // content-type is needed since S3 is bad at guessing mime types
//                 }
//                 return s3.putObject( put_config ).promise()
//             } )
//         } ) )
//     } )
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xpZW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkNsaWVudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBOEI7QUFDOUIsNkJBQTRCO0FBQzVCLGlDQUFpQztBQUNqQyxpQ0FBaUM7QUFDakMsK0JBQStCO0FBRS9CLHFDQUFvQztBQUNwQyxtQ0FBa0M7QUFDbEMseUNBQXdDO0FBTzNCLFFBQUEsU0FBUyxHQUFHLFVBQVcsTUFBYyxFQUFFLE1BQWM7SUFDOUQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUUsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLENBQUUsQ0FBQTtBQUNoRCxDQUFDLENBQUE7QUFFRCxNQUFNLGFBQWEsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBRSxJQUFJLENBQUMsR0FBRyxDQUFFLEVBQUUsQ0FBRSxDQUFFLENBQUE7QUFFakUsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFFLEVBQUUsQ0FBRSxDQUFBO0FBRXhCLFFBQUEsY0FBYyxHQUFHLFVBQVcsTUFBYztJQUNuRCxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBRSxNQUFNLENBQUMsTUFBTSxDQUFFO1NBQ25DLElBQUksQ0FBRSxTQUFTLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBRSxDQUFFO1NBQ3RELElBQUksQ0FBRSxTQUFTLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUUsU0FBUyxDQUFDLEtBQUssQ0FBRSxNQUFNLENBQUMsTUFBTSxDQUFFLENBQUUsQ0FBRTtTQUN0RSxJQUFJLENBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFFLENBQUE7QUFDN0IsQ0FBQyxDQUFBO0FBRVksUUFBQSxZQUFZLEdBQUcsVUFBVyxNQUFjO0lBQ2pELE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFFLE1BQU0sQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBRTtTQUNoRCxJQUFJLENBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBRTtTQUN2QixJQUFJLENBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBRTtTQUN0QixJQUFJLENBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFFLENBQUE7QUFDN0IsQ0FBQyxDQUFBO0FBRVksUUFBQSxXQUFXLEdBQUcsVUFBVyxNQUFjO0lBQ2hELE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFFLE1BQU0sQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBRTtTQUMvQyxJQUFJLENBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBRTtTQUN0QixJQUFJLENBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFFLENBQUE7QUFDN0IsQ0FBQyxDQUFBO0FBRVksUUFBQSxZQUFZLEdBQUcsVUFBVyxNQUFjO0lBQ2pELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUUsTUFBTSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUUsQ0FBQTtJQUN4RCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFFLE1BQU0sQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFFLENBQUE7SUFFeEQsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUUsVUFBVSxFQUFFLFVBQVUsQ0FBRTtTQUNuQyxJQUFJLENBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFFLENBQUE7QUFDN0IsQ0FBQyxDQUFBO0FBRUQsc0ZBQXNGO0FBQ3RGLDBDQUEwQztBQUMxQyxFQUFFO0FBQ0YsdURBQXVEO0FBQ3ZELDZEQUE2RDtBQUM3RCxxRUFBcUU7QUFDckUsdUNBQXVDO0FBQ3ZDLG9DQUFvQztBQUNwQyxzQ0FBc0M7QUFDdEMsNkRBQTZEO0FBQzdELHlIQUF5SDtBQUN6SCxvQkFBb0I7QUFDcEIsOERBQThEO0FBQzlELGtCQUFrQjtBQUNsQixnQkFBZ0I7QUFDaEIsVUFBVTtBQUNWLElBQUkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBGUyBmcm9tIFwiZnMtZXh0cmFcIlxuaW1wb3J0ICogYXMgUGF0aCBmcm9tIFwicGF0aFwiXG4vLyBpbXBvcnQgKiBhcyBBV1MgZnJvbSBcImF3cy1zZGtcIlxuLy8gaW1wb3J0ICogYXMgR2xvYiBmcm9tIFwiZ2xvYmJ5XCJcbi8vIGltcG9ydCAqIGFzIE1pbWUgZnJvbSBcIm1pbWVcIlxuXG5pbXBvcnQgKiBhcyBTY3JpcHRzIGZyb20gXCIuL1NjcmlwdHNcIlxuaW1wb3J0ICogYXMgU3R5bGVzIGZyb20gXCIuL1N0eWxlc1wiXG5pbXBvcnQgKiBhcyBUZW1wbGF0ZXMgZnJvbSBcIi4vVGVtcGxhdGVzXCJcblxudHlwZSBDb25maWcgPSB7XG4gICAgc291cmNlOiBzdHJpbmcsXG4gICAgdGFyZ2V0OiBzdHJpbmdcbn1cblxuZXhwb3J0IGNvbnN0IGNvbmZpZ3VyZSA9IGZ1bmN0aW9uICggc291cmNlOiBzdHJpbmcsIHRhcmdldDogc3RyaW5nICkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoIHsgc291cmNlLCB0YXJnZXQgfSApXG59XG5cbmNvbnN0IG1hcFRvUHJvbWlzZXMgPSBmbiA9PiBsaXN0ID0+IFByb21pc2UuYWxsKCBsaXN0Lm1hcCggZm4gKSApXG5cbmNvbnN0IGxvZ2l0ID0gaXQgPT4gY29uc29sZS5sb2coIGl0IClcblxuZXhwb3J0IGNvbnN0IGJ1aWxkVGVtcGxhdGVzID0gZnVuY3Rpb24gKCBjb25maWc6IENvbmZpZyApIHtcbiAgICByZXR1cm4gVGVtcGxhdGVzLmRldGVjdCggY29uZmlnLnNvdXJjZSApXG4gICAgICAgIC50aGVuKCB0ZW1wbGF0ZXMgPT4gdGVtcGxhdGVzLm1hcCggVGVtcGxhdGVzLnJlbmRlciApIClcbiAgICAgICAgLnRoZW4oIHRlbXBsYXRlcyA9PiB0ZW1wbGF0ZXMubWFwKCBUZW1wbGF0ZXMud3JpdGUoIGNvbmZpZy50YXJnZXQgKSApIClcbiAgICAgICAgLnRoZW4oICgpID0+IGNvbmZpZyApXG59XG5cbmV4cG9ydCBjb25zdCBidWlsZFNjcmlwdHMgPSBmdW5jdGlvbiAoIGNvbmZpZzogQ29uZmlnICkge1xuICAgIHJldHVybiBTY3JpcHRzLmRldGVjdCggY29uZmlnLnNvdXJjZSwgY29uZmlnLnRhcmdldCApXG4gICAgICAgIC50aGVuKCBTY3JpcHRzLmNvbXBpbGUgKVxuICAgICAgICAudGhlbiggU2NyaXB0cy5idW5kbGUgKVxuICAgICAgICAudGhlbiggKCkgPT4gY29uZmlnIClcbn1cblxuZXhwb3J0IGNvbnN0IGJ1aWxkU3R5bGVzID0gZnVuY3Rpb24gKCBjb25maWc6IENvbmZpZyApIHtcbiAgICByZXR1cm4gU3R5bGVzLmRldGVjdCggY29uZmlnLnNvdXJjZSwgY29uZmlnLnRhcmdldCApXG4gICAgICAgIC50aGVuKCBTdHlsZXMuY29tcGlsZSApXG4gICAgICAgIC50aGVuKCAoKSA9PiBjb25maWcgKVxufVxuXG5leHBvcnQgY29uc3QgYnVpbGRTdGF0aWNzID0gZnVuY3Rpb24gKCBjb25maWc6IENvbmZpZyApIHtcbiAgICBjb25zdCBzb3VyY2VfZGlyID0gUGF0aC5qb2luKCBjb25maWcuc291cmNlLCBcInN0YXRpY3NcIiApXG4gICAgY29uc3QgdGFyZ2V0X2RpciA9IFBhdGguam9pbiggY29uZmlnLnRhcmdldCwgXCJzdGF0aWNzXCIgKVxuXG4gICAgcmV0dXJuIEZTLmNvcHkoIHNvdXJjZV9kaXIsIHRhcmdldF9kaXIgKVxuICAgICAgICAudGhlbiggKCkgPT4gY29uZmlnIClcbn1cblxuLy8gZXhwb3J0IGNvbnN0IGRlcGxveSA9IGZ1bmN0aW9uICggc291cmNlOiBzdHJpbmcsIHRhcmdldDogc3RyaW5nLCByZWdpb246IHN0cmluZyApIHtcbi8vICAgICBjb25zdCBzMyA9IG5ldyBBV1MuUzMoIHsgcmVnaW9uIH0gKVxuLy9cbi8vICAgICByZXR1cm4gR2xvYiggc291cmNlICkudGhlbiggZnVuY3Rpb24gKCBmaWxlcyApIHtcbi8vICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKCBmaWxlcy5tYXAoIGZ1bmN0aW9uICggZmlsZSApIHtcbi8vICAgICAgICAgICAgIHJldHVybiBGUy5yZWFkRmlsZSggZmlsZSApLnRoZW4oIGZ1bmN0aW9uICggYnVmZmVyICkge1xuLy8gICAgICAgICAgICAgICAgIGNvbnN0IHB1dF9jb25maWcgPSB7XG4vLyAgICAgICAgICAgICAgICAgICAgIEJvZHk6IGJ1ZmZlcixcbi8vICAgICAgICAgICAgICAgICAgICAgQnVja2V0OiB0YXJnZXQsXG4vLyAgICAgICAgICAgICAgICAgICAgIEtleTogZmlsZS5yZXBsYWNlKCBzb3VyY2UgKyBcIi9cIiwgXCJcIiApLFxuLy8gICAgICAgICAgICAgICAgICAgICBDb250ZW50VHlwZTogTWltZS5nZXRUeXBlKCBmaWxlICkgLy8gY29udGVudC10eXBlIGlzIG5lZWRlZCBzaW5jZSBTMyBpcyBiYWQgYXQgZ3Vlc3NpbmcgbWltZSB0eXBlc1xuLy8gICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgICByZXR1cm4gczMucHV0T2JqZWN0KCBwdXRfY29uZmlnICkucHJvbWlzZSgpXG4vLyAgICAgICAgICAgICB9IClcbi8vICAgICAgICAgfSApIClcbi8vICAgICB9IClcbi8vIH1cbiJdfQ==