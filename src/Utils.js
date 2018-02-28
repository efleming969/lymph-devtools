"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiline = function (strings, ...args) {
    const whitespace = /^\s*|\n\s*$/g;
    const find_indent = /^[ \t\r]*\| (.*)$/gm;
    return strings.reduce(function (out, part, i) {
        if (args.hasOwnProperty(i)) {
            const lines = part.split('\n');
            // find indention of the current line
            const indent = lines[lines.length - 1].replace(/[ \t\r]*\| ([ \t\r]*).*$/, '$1');
            // indent interpolated lines to match
            const tail = (args[i] || '').split('\n').join('\n' + indent);
            return out + part + tail;
        }
        else {
            return out + part;
        }
    }, '').replace(whitespace, '').replace(find_indent, '$1');
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJVdGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFhLFFBQUEsU0FBUyxHQUFHLFVBQVUsT0FBTyxFQUFFLEdBQUcsSUFBSTtJQUUvQyxNQUFNLFVBQVUsR0FBRyxjQUFjLENBQUE7SUFDakMsTUFBTSxXQUFXLEdBQUcscUJBQXFCLENBQUE7SUFFekMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUUsVUFBVyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUM7UUFDMUMsRUFBRSxDQUFDLENBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBRSxDQUFDLENBQUcsQ0FBQyxDQUFDLENBQUM7WUFDN0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBRSxJQUFJLENBQUUsQ0FBQztZQUNqQyxxQ0FBcUM7WUFDckMsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFFLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFFLENBQUMsT0FBTyxDQUFFLDBCQUEwQixFQUFFLElBQUksQ0FBRSxDQUFDO1lBQ3JGLHFDQUFxQztZQUNyQyxNQUFNLElBQUksR0FBRyxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUUsSUFBSSxDQUFFLENBQUMsSUFBSSxDQUFFLElBQUksR0FBRyxNQUFNLENBQUUsQ0FBQztZQUNuRSxNQUFNLENBQUMsR0FBRyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUM7UUFDN0IsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7UUFDdEIsQ0FBQztJQUNMLENBQUMsRUFBRSxFQUFFLENBQUUsQ0FBQyxPQUFPLENBQUUsVUFBVSxFQUFFLEVBQUUsQ0FBRSxDQUFDLE9BQU8sQ0FBRSxXQUFXLEVBQUUsSUFBSSxDQUFFLENBQUE7QUFDbEUsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IG11bHRpbGluZSA9IGZ1bmN0aW9uKCBzdHJpbmdzLCAuLi5hcmdzICkge1xuXG4gICAgY29uc3Qgd2hpdGVzcGFjZSA9IC9eXFxzKnxcXG5cXHMqJC9nXG4gICAgY29uc3QgZmluZF9pbmRlbnQgPSAvXlsgXFx0XFxyXSpcXHwgKC4qKSQvZ21cblxuICAgIHJldHVybiBzdHJpbmdzLnJlZHVjZSggZnVuY3Rpb24gKCBvdXQsIHBhcnQsIGkgKSB7XG4gICAgICAgIGlmICggYXJncy5oYXNPd25Qcm9wZXJ0eSggaSApICkge1xuICAgICAgICAgICAgY29uc3QgbGluZXMgPSBwYXJ0LnNwbGl0KCAnXFxuJyApO1xuICAgICAgICAgICAgLy8gZmluZCBpbmRlbnRpb24gb2YgdGhlIGN1cnJlbnQgbGluZVxuICAgICAgICAgICAgY29uc3QgaW5kZW50ID0gbGluZXNbIGxpbmVzLmxlbmd0aCAtIDEgXS5yZXBsYWNlKCAvWyBcXHRcXHJdKlxcfCAoWyBcXHRcXHJdKikuKiQvLCAnJDEnICk7XG4gICAgICAgICAgICAvLyBpbmRlbnQgaW50ZXJwb2xhdGVkIGxpbmVzIHRvIG1hdGNoXG4gICAgICAgICAgICBjb25zdCB0YWlsID0gKGFyZ3NbIGkgXSB8fCAnJykuc3BsaXQoICdcXG4nICkuam9pbiggJ1xcbicgKyBpbmRlbnQgKTtcbiAgICAgICAgICAgIHJldHVybiBvdXQgKyBwYXJ0ICsgdGFpbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBvdXQgKyBwYXJ0O1xuICAgICAgICB9XG4gICAgfSwgJycgKS5yZXBsYWNlKCB3aGl0ZXNwYWNlLCAnJyApLnJlcGxhY2UoIGZpbmRfaW5kZW50LCAnJDEnIClcbn1cbiJdfQ==