


// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/force-directed-graph
function ForceGraph({
    nodes, // an iterable of node objects (typically [{id}, …])
    links // an iterable of link objects (typically [{source, target}, …])
}, {
    nodeId = d => d.id, // given d in nodes, returns a unique identifier (string)
    nodeGroup, // given d in nodes, returns an (ordinal) value for color
    nodeGroups, // an array of ordinal values representing the node groups
    nodeTitle, // given d in nodes, a title string
    nodeFill = "currentColor", // node stroke fill (if not using a group color encoding)
    nodeStroke = "#fff", // node stroke color
    nodeStrokeWidth = 1.5, // node stroke width, in pixels
    nodeStrokeOpacity = 1, // node stroke opacity
    nodeRadius = 5, // node radius, in pixels
    nodeStrength,
    linkSource = ({ source }) => source, // given d in links, returns a node identifier string
    linkTarget = ({ target }) => target, // given d in links, returns a node identifier string
    linkStroke = "#999", // link stroke color
    linkStrokeOpacity = 0.6, // link stroke opacity
    linkStrokeWidth = 1.5, // given d in links, returns a stroke width in pixels
    linkStrokeLinecap = "round", // link stroke linecap
    linkStrength,
    colors = d3.schemeTableau10, // an array of color strings, for the node groups
    width = 800, // outer width, in pixels
    height = 900, // outer height, in pixels
    invalidation // when this promise resolves, stop the simulation
} = {}) {
    // Compute values.
    const N = d3.map(nodes, nodeId).map(intern);
    const LS = d3.map(links, linkSource).map(intern);
    const LT = d3.map(links, linkTarget).map(intern);
    if (nodeTitle === undefined) nodeTitle = (_, i) => N[i];
    const T = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
    const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
    const W = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);
    const L = typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);

    // Replace the input nodes and links with mutable objects for the simulation.
    nodes = d3.map(nodes, (_, i) => ({ id: N[i] }));
    links = d3.map(links, (_, i) => ({ source: LS[i], target: LT[i] }));

    // Compute default domains.
    if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);

    // Construct the scales.
    const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

    // Construct the forces.
    const forceNode = d3.forceManyBody();
    const forceLink = d3.forceLink(links).id(({ index: i }) => N[i]);
    if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
    if (linkStrength !== undefined) forceLink.strength(linkStrength);

    const simulation = d3.forceSimulation(nodes)
        .force("link", forceLink)
        .force("charge", forceNode)
        .force("center", d3.forceCenter())
        .on("tick", ticked);

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    const link = svg.append("g")
        .attr("stroke", typeof linkStroke !== "function" ? linkStroke : null)
        .attr("stroke-opacity", linkStrokeOpacity)
        .attr("stroke-width", typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null)
        .attr("stroke-linecap", linkStrokeLinecap)
        .selectAll("line")
        .data(links)
        .join("line");

    const node = svg.append("g")
        .attr("fill", nodeFill)
        .attr("stroke", nodeStroke)
        .attr("stroke-opacity", nodeStrokeOpacity)
        .attr("stroke-width", nodeStrokeWidth)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", nodeRadius)
        .call(drag(simulation));

    if (W) link.attr("stroke-width", ({ index: i }) => W[i]);
    if (L) link.attr("stroke", ({ index: i }) => L[i]);
    if (G) node.attr("fill", ({ index: i }) => color(G[i]));
    if (T) node.append("title").text(({ index: i }) => T[i]);
    if (invalidation != null) invalidation.then(() => simulation.stop());

    function intern(value) {
        return value !== null && typeof value === "object" ? value.valueOf() : value;
    }

    function ticked() {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    }

    function drag(simulation) {
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    return Object.assign(svg.node(), { scales: { color } });
}
selectedDataElements = {};
dataelements = giveElements();

function buildSvg(selectedElements) {
    var svg = ForceGraph(selectedElements, {
        id: "mySvg",
        nodeId: d => d.id,
        nodeGroup: d => d.group,
        nodeTitle: d => `${d.id}\n${d.ntype}`,
        linkStrokeWidth: l => Math.sqrt(l.value),
        width: 1930,
        heigh: 800,
        invalidation: null
    });
    return svg;

}

document.addEventListener('DOMContentLoaded', function (e) {
    selectedDataElements = dataelements;
    var svg = buildSvg(selectedDataElements);
    $("#container").html(svg);
    listSelectedConnectors();
})

function searchFromPanel(element) {
    $("#searchval").val(element);
    rebuildSvg();
}

function listSelectedConnectors() {
    selectedDataElements.nodes.forEach((element, index, array) => {
        if (element.group == 1) {
            $("#tables").append("<button class='panelbutton' onclick=searchFromPanel('" + element.id + "')>" + element.id + "("+ element.depth +")" + "</button>");
        }

        if (element.group == 2) {
            $("#svc").append("<button class='panelbutton' onclick=searchFromPanel('" + element.id + "')>" + element.id +  "("+ element.depth +")" +"</button>");
        }

        if (element.group == 3) {
            $("#web").append("<button class='panelbutton' onclick=searchFromPanel('" + element.id + "')>" + element.id + "("+ element.depth +")" + "</button>");
        }

        if (element.group == 4) {
            $("#batch").append("<button class='panelbutton' onclick=searchFromPanel('" + element.id + "')>" + element.id + "("+ element.depth +")" + "</button>");
        }

    });
}

function checkNodes(newDataElements, nodename) {
    var found = false;
    newDataElements.nodes.forEach((node, index2, array2) => {
        if (node.id === nodename) {
            found = true;
        }
    });
    return found;
}

function resetSvg() {
    document.getElementById('searchval').value = "";
    selectedDataElements = dataelements;
    var svg = buildSvg(selectedDataElements);
    $("#container").html(svg);
    listSelectedConnectors();
}

function rebuildSvg() {
    $("#container").empty();
    $("#tables").empty();
    $("#svc").empty();
    $("#web").empty();
    $("#batch").empty();

    var sval = $("#searchval").val();

    var newDataElements = {
        nodes: [],
        links: []
    }

    var depthOfSearch = $("#depthval").val();

    var nodeList = [];
    nodeList.push(sval);
    var count = 0;
    newDataElements = traverseNode(dataelements, newDataElements, nodeList, count+1);
    count++;

    for(var i = count; i < depthOfSearch; i++){
        newDataElements = traverseNode(dataelements, newDataElements, newDataElements.nodes, i+1);
    }
    

    selectedDataElements = newDataElements;
    var svg = buildSvg(selectedDataElements);
    $("#container").html(svg);
    listSelectedConnectors();

}

function walkNodeList(nodeList, searchvar){
    var found = false;
    nodeList.forEach((element, index, array) => {
        if(element.id===searchvar){
            found = true;
        }

        if(element===searchvar){
            found = true;
        }
    });
    return found;
}

function traverseNode(dataelements, newDataElements, nodeList, depth){
    dataelements.links.forEach((element, index, array) => {
        if (walkNodeList(nodeList,element.source) || walkNodeList(nodeList,element.target)) {
            dataelements.nodes.forEach((subElement, index2, array2) => {
                if (subElement.id === element.target || subElement.id === element.source) {
                    if (!(checkNodes(newDataElements, subElement.id))) {
                        subElement.depth = depth;
                        newDataElements.nodes.push(subElement);
                    }
                }
            });
            newDataElements.links.push(element);
        }
    });
    return newDataElements;
}

function exportRelationships(){
    exportToCsv("myFile.csv", selectedDataElements.links);
}

function findDepthValue(id){
    var depthVal = 0;
    selectedDataElements.nodes.forEach((element, index, array) => {
        if(element.id === id){
            depthVal = element.depth;
        }
    });
    return depthVal;
}

function findSupporTeam(id){
    var team = '';
    selectedDataElements.nodes.forEach((element, index, array) => {
        if(element.id === id){
            team = element.supportteam;
        }
    });
    return team;
}

function exportToCsv(filename, rows) {
    var processRow = function (row) {
        var finalVal = "source: " + row.source + ", target: " + row.target + ", depth:" + findDepthValue(row.target) +", supportteam:"+findSupporTeam(row.target);
        return finalVal + '\n';
    };

    var csvFile = '';
    for (var i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
    }

    var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}
