const sanitizeMermaid = (chart) => {
  if (!chart) return '';
  let str = chart.replace(/\\n/g, '\n');
  if (!str.includes('\n') && (str.includes('flowchart') || str.includes('graph') || str.includes('stateDiagram') || str.includes('sequenceDiagram'))) {
    str = str.replace(/(flowchart\s+\w+|graph\s+\w+|stateDiagram-v2|sequenceDiagram)\s+/, "$1\n");
    str = str.replace(/([\])}|])\s+(?=[A-Za-z0-9_"-]+(\s+-->|\s*-+>|\s+==>|\s+-\.->|\[|\(|\{))/g, "$1\n");
    str = str.replace(/([A-Za-z0-9_"-]+)\s+(?=[A-Za-z0-9_"-]+(\s+-->|\s*-+>))/g, "$1\n"); // Handle flat names A --> B C --> D
  }
  return str;
};
console.log(sanitizeMermaid('graph TD A --> B B --> C'));
console.log(sanitizeMermaid('flowchart LR A[Containerization] --> B[Container Creation] B --> C[Container Configuration]'));
console.log(sanitizeMermaid('flowchart LR A --> B C --> D'));
console.log(sanitizeMermaid('sequenceDiagram Alice->>Bob: Hello Bob, how are you? Bob-->>Alice: I am good thanks!'));
