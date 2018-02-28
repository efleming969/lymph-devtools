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
//
// export const configure = function ( source: string, target: string ) {
//     return Promise.resolve( { source, target } )
// }
//
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xpZW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkNsaWVudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBOEI7QUFDOUIsNkJBQTRCO0FBQzVCLGlDQUFpQztBQUNqQyxpQ0FBaUM7QUFDakMsK0JBQStCO0FBRS9CLHFDQUFvQztBQUNwQyxtQ0FBa0M7QUFDbEMseUNBQXdDO0FBTXhDLEVBQUU7QUFDRix5RUFBeUU7QUFDekUsbURBQW1EO0FBQ25ELElBQUk7QUFDSixFQUFFO0FBQ0YsTUFBTSxhQUFhLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBRSxFQUFFLENBQUUsQ0FBRSxDQUFBO0FBRWpFLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBRSxFQUFFLENBQUUsQ0FBQTtBQUV4QixRQUFBLGNBQWMsR0FBRyxVQUFXLE1BQWM7SUFDbkQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBRTtTQUNuQyxJQUFJLENBQUUsU0FBUyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUUsQ0FBRTtTQUN0RCxJQUFJLENBQUUsU0FBUyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBRSxDQUFFLENBQUU7U0FDdEUsSUFBSSxDQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBRSxDQUFBO0FBQzdCLENBQUMsQ0FBQTtBQUVZLFFBQUEsWUFBWSxHQUFHLFVBQVcsTUFBYztJQUNqRCxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBRSxNQUFNLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUU7U0FDaEQsSUFBSSxDQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUU7U0FDdkIsSUFBSSxDQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUU7U0FDdEIsSUFBSSxDQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBRSxDQUFBO0FBQzdCLENBQUMsQ0FBQTtBQUVZLFFBQUEsV0FBVyxHQUFHLFVBQVcsTUFBYztJQUNoRCxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBRSxNQUFNLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUU7U0FDL0MsSUFBSSxDQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUU7U0FDdEIsSUFBSSxDQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBRSxDQUFBO0FBQzdCLENBQUMsQ0FBQTtBQUVZLFFBQUEsWUFBWSxHQUFHLFVBQVcsTUFBYztJQUNqRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFFLE1BQU0sQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFFLENBQUE7SUFDeEQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBRSxNQUFNLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBRSxDQUFBO0lBRXhELE1BQU0sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFFLFVBQVUsRUFBRSxVQUFVLENBQUU7U0FDbkMsSUFBSSxDQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBRSxDQUFBO0FBQzdCLENBQUMsQ0FBQTtBQUVELHNGQUFzRjtBQUN0RiwwQ0FBMEM7QUFDMUMsRUFBRTtBQUNGLHVEQUF1RDtBQUN2RCw2REFBNkQ7QUFDN0QscUVBQXFFO0FBQ3JFLHVDQUF1QztBQUN2QyxvQ0FBb0M7QUFDcEMsc0NBQXNDO0FBQ3RDLDZEQUE2RDtBQUM3RCx5SEFBeUg7QUFDekgsb0JBQW9CO0FBQ3BCLDhEQUE4RDtBQUM5RCxrQkFBa0I7QUFDbEIsZ0JBQWdCO0FBQ2hCLFVBQVU7QUFDVixJQUFJIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgRlMgZnJvbSBcImZzLWV4dHJhXCJcbmltcG9ydCAqIGFzIFBhdGggZnJvbSBcInBhdGhcIlxuLy8gaW1wb3J0ICogYXMgQVdTIGZyb20gXCJhd3Mtc2RrXCJcbi8vIGltcG9ydCAqIGFzIEdsb2IgZnJvbSBcImdsb2JieVwiXG4vLyBpbXBvcnQgKiBhcyBNaW1lIGZyb20gXCJtaW1lXCJcblxuaW1wb3J0ICogYXMgU2NyaXB0cyBmcm9tIFwiLi9TY3JpcHRzXCJcbmltcG9ydCAqIGFzIFN0eWxlcyBmcm9tIFwiLi9TdHlsZXNcIlxuaW1wb3J0ICogYXMgVGVtcGxhdGVzIGZyb20gXCIuL1RlbXBsYXRlc1wiXG5cbnR5cGUgQ29uZmlnID0ge1xuICAgIHNvdXJjZTogc3RyaW5nLFxuICAgIHRhcmdldDogc3RyaW5nXG59XG4vL1xuLy8gZXhwb3J0IGNvbnN0IGNvbmZpZ3VyZSA9IGZ1bmN0aW9uICggc291cmNlOiBzdHJpbmcsIHRhcmdldDogc3RyaW5nICkge1xuLy8gICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoIHsgc291cmNlLCB0YXJnZXQgfSApXG4vLyB9XG4vL1xuY29uc3QgbWFwVG9Qcm9taXNlcyA9IGZuID0+IGxpc3QgPT4gUHJvbWlzZS5hbGwoIGxpc3QubWFwKCBmbiApIClcblxuY29uc3QgbG9naXQgPSBpdCA9PiBjb25zb2xlLmxvZyggaXQgKVxuXG5leHBvcnQgY29uc3QgYnVpbGRUZW1wbGF0ZXMgPSBmdW5jdGlvbiAoIGNvbmZpZzogQ29uZmlnICkge1xuICAgIHJldHVybiBUZW1wbGF0ZXMuZGV0ZWN0KCBjb25maWcuc291cmNlIClcbiAgICAgICAgLnRoZW4oIHRlbXBsYXRlcyA9PiB0ZW1wbGF0ZXMubWFwKCBUZW1wbGF0ZXMucmVuZGVyICkgKVxuICAgICAgICAudGhlbiggdGVtcGxhdGVzID0+IHRlbXBsYXRlcy5tYXAoIFRlbXBsYXRlcy53cml0ZSggY29uZmlnLnRhcmdldCApICkgKVxuICAgICAgICAudGhlbiggKCkgPT4gY29uZmlnIClcbn1cblxuZXhwb3J0IGNvbnN0IGJ1aWxkU2NyaXB0cyA9IGZ1bmN0aW9uICggY29uZmlnOiBDb25maWcgKSB7XG4gICAgcmV0dXJuIFNjcmlwdHMuZGV0ZWN0KCBjb25maWcuc291cmNlLCBjb25maWcudGFyZ2V0IClcbiAgICAgICAgLnRoZW4oIFNjcmlwdHMuY29tcGlsZSApXG4gICAgICAgIC50aGVuKCBTY3JpcHRzLmJ1bmRsZSApXG4gICAgICAgIC50aGVuKCAoKSA9PiBjb25maWcgKVxufVxuXG5leHBvcnQgY29uc3QgYnVpbGRTdHlsZXMgPSBmdW5jdGlvbiAoIGNvbmZpZzogQ29uZmlnICkge1xuICAgIHJldHVybiBTdHlsZXMuZGV0ZWN0KCBjb25maWcuc291cmNlLCBjb25maWcudGFyZ2V0IClcbiAgICAgICAgLnRoZW4oIFN0eWxlcy5jb21waWxlIClcbiAgICAgICAgLnRoZW4oICgpID0+IGNvbmZpZyApXG59XG5cbmV4cG9ydCBjb25zdCBidWlsZFN0YXRpY3MgPSBmdW5jdGlvbiAoIGNvbmZpZzogQ29uZmlnICkge1xuICAgIGNvbnN0IHNvdXJjZV9kaXIgPSBQYXRoLmpvaW4oIGNvbmZpZy5zb3VyY2UsIFwic3RhdGljc1wiIClcbiAgICBjb25zdCB0YXJnZXRfZGlyID0gUGF0aC5qb2luKCBjb25maWcudGFyZ2V0LCBcInN0YXRpY3NcIiApXG5cbiAgICByZXR1cm4gRlMuY29weSggc291cmNlX2RpciwgdGFyZ2V0X2RpciApXG4gICAgICAgIC50aGVuKCAoKSA9PiBjb25maWcgKVxufVxuXG4vLyBleHBvcnQgY29uc3QgZGVwbG95ID0gZnVuY3Rpb24gKCBzb3VyY2U6IHN0cmluZywgdGFyZ2V0OiBzdHJpbmcsIHJlZ2lvbjogc3RyaW5nICkge1xuLy8gICAgIGNvbnN0IHMzID0gbmV3IEFXUy5TMyggeyByZWdpb24gfSApXG4vL1xuLy8gICAgIHJldHVybiBHbG9iKCBzb3VyY2UgKS50aGVuKCBmdW5jdGlvbiAoIGZpbGVzICkge1xuLy8gICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoIGZpbGVzLm1hcCggZnVuY3Rpb24gKCBmaWxlICkge1xuLy8gICAgICAgICAgICAgcmV0dXJuIEZTLnJlYWRGaWxlKCBmaWxlICkudGhlbiggZnVuY3Rpb24gKCBidWZmZXIgKSB7XG4vLyAgICAgICAgICAgICAgICAgY29uc3QgcHV0X2NvbmZpZyA9IHtcbi8vICAgICAgICAgICAgICAgICAgICAgQm9keTogYnVmZmVyLFxuLy8gICAgICAgICAgICAgICAgICAgICBCdWNrZXQ6IHRhcmdldCxcbi8vICAgICAgICAgICAgICAgICAgICAgS2V5OiBmaWxlLnJlcGxhY2UoIHNvdXJjZSArIFwiL1wiLCBcIlwiICksXG4vLyAgICAgICAgICAgICAgICAgICAgIENvbnRlbnRUeXBlOiBNaW1lLmdldFR5cGUoIGZpbGUgKSAvLyBjb250ZW50LXR5cGUgaXMgbmVlZGVkIHNpbmNlIFMzIGlzIGJhZCBhdCBndWVzc2luZyBtaW1lIHR5cGVzXG4vLyAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgIHJldHVybiBzMy5wdXRPYmplY3QoIHB1dF9jb25maWcgKS5wcm9taXNlKClcbi8vICAgICAgICAgICAgIH0gKVxuLy8gICAgICAgICB9ICkgKVxuLy8gICAgIH0gKVxuLy8gfVxuIl19