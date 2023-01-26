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
        dataelements = {
            nodes: [
                { id: "table1", group: 1 },
                { id: "table2", group: 1 },
                { id: "table3", group: 1 },
                { id: "table4", group: 1 },
                { id: "table5", group: 1 },
                { id: "table6", group: 1 },
                { id: "table7", group: 1 },
                { id: "table8", group: 1 },
                { id: "table9", group: 1 },
                { id: "table10", group: 1 },
                { id: "table11", group: 1 },
                { id: "table12", group: 1 },
                { id: "table13", group: 1 },
                { id: "table14", group: 1 },
                { id: "table15", group: 1 },
                { id: "table16", group: 1 },
                { id: "table17", group: 1 },
                { id: "table18", group: 1 },
                { id: "table19", group: 1 },
                { id: "table20", group: 1 },
                { id: "table21", group: 1 },
                { id: "table22", group: 1 },
                { id: "table23", group: 1 },
                { id: "table24", group: 1 },
                { id: "table25", group: 1 },
                { id: "table26", group: 1 },
                { id: "table27", group: 1 },
                { id: "table28", group: 1 },
                { id: "table29", group: 1 },
                { id: "table30", group: 1 },
                { id: "table31", group: 1 },
                { id: "table32", group: 1 },
                { id: "table33", group: 1 },
                { id: "table34", group: 1 },
                { id: "table35", group: 1 },
                { id: "table36", group: 1 },
                { id: "table37", group: 1 },
                { id: "table38", group: 1 },
                { id: "table39", group: 1 },
                { id: "table40", group: 1 },
                { id: "table41", group: 1 },
                { id: "table42", group: 1 },
                { id: "table43", group: 1 },
                { id: "table44", group: 1 },
                { id: "table45", group: 1 },
                { id: "table46", group: 1 },
                { id: "table47", group: 1 },
                { id: "table48", group: 1 },
                { id: "table49", group: 1 },
                { id: "table50", group: 1 },


                { id: "svc1", group: 2 },
                { id: "svc2", group: 2 },
                { id: "svc3", group: 2 },
                { id: "svc4", group: 2 },
                { id: "svc5", group: 2 },
                { id: "svc6", group: 2 },
                { id: "svc7", group: 2 },
                { id: "svc8", group: 2 },
                { id: "svc9", group: 2 },
                { id: "svc10", group: 2 },


                { id: "web1", group: 3 },
                { id: "web2", group: 3 },
                { id: "web3", group: 3 },
                { id: "web4", group: 3 },
                { id: "web5", group: 3 },
                { id: "web6", group: 3 },
                { id: "web7", group: 3 },
                { id: "web8", group: 3 },
                { id: "web9", group: 3 },
                { id: "web10", group: 3 },

                { id: "batch1", group: 4 },
                { id: "batch2", group: 4 },
                { id: "batch3", group: 4 },
                { id: "batch4", group: 4 },
                { id: "batch5", group: 4 },
                { id: "batch6", group: 4 },
                { id: "batch7", group: 4 },
                { id: "batch8", group: 4 },
                { id: "batch9", group: 4 },
                { id: "batch10", group: 4 },


            ],

            links: [
                { source: "table1", target: "svc1", value: 1 },
                { source: "table1", target: "svc3", value: 1 },
                { source: "table1", target: "svc4", value: 1 },
                { source: "table1", target: "svc5", value: 1 },
                { source: "table2", target: "svc1", value: 1 },
                { source: "table3", target: "svc1", value: 1 },
                { source: "table4", target: "svc2", value: 1 },
                { source: "table2", target: "svc2", value: 1 },
                { source: "table5", target: "svc2", value: 1 },

                { source: "table1", target: "svc2", value: 1 },
                { source: "table4", target: "svc2", value: 1 },
                { source: "table5", target: "svc2", value: 1 },
                { source: "table6", target: "svc2", value: 1 },
                { source: "table7", target: "svc2", value: 1 },
                { source: "table8", target: "svc2", value: 1 },
                { source: "table9", target: "svc2", value: 1 },
                { source: "table10", target: "svc2", value: 1 },
                { source: "table11", target: "svc2", value: 1 },
                { source: "table12", target: "svc2", value: 1 },
                { source: "table13", target: "svc2", value: 1 },
                { source: "table14", target: "svc2", value: 1 },
                { source: "table15", target: "svc2", value: 1 },
                { source: "table16", target: "svc2", value: 1 },
                { source: "table17", target: "svc2", value: 1 },
                { source: "table18", target: "svc2", value: 1 },
                { source: "table19", target: "svc2", value: 1 },
                { source: "table20", target: "svc2", value: 1 },
                { source: "table21", target: "svc2", value: 1 },
                { source: "table22", target: "svc2", value: 1 },
                { source: "table23", target: "svc2", value: 1 },
                { source: "table24", target: "svc2", value: 1 },
                { source: "table25", target: "svc2", value: 1 },
                { source: "table26", target: "svc2", value: 1 },
                { source: "table27", target: "svc2", value: 1 },
                { source: "table28", target: "svc2", value: 1 },
                { source: "table29", target: "svc2", value: 1 },
                { source: "table30", target: "svc2", value: 1 },
                { source: "table31", target: "svc2", value: 1 },
                { source: "table32", target: "svc2", value: 1 },
                { source: "table33", target: "svc2", value: 1 },
                { source: "table34", target: "svc2", value: 1 },
                { source: "table35", target: "svc2", value: 1 },
                { source: "table36", target: "svc2", value: 1 },
                { source: "table37", target: "svc2", value: 1 },
                { source: "table38", target: "svc2", value: 1 },
                { source: "table39", target: "svc2", value: 1 },
                { source: "table40", target: "svc2", value: 1 },
                { source: "table41", target: "svc2", value: 1 },
                { source: "table42", target: "svc2", value: 1 },
                { source: "table43", target: "svc2", value: 1 },
                { source: "table44", target: "svc2", value: 1 },
                { source: "table45", target: "svc2", value: 1 },
                { source: "table46", target: "svc2", value: 1 },
                { source: "table47", target: "svc2", value: 1 },
                { source: "table48", target: "svc2", value: 1 },
                { source: "table49", target: "svc2", value: 1 },
                { source: "table50", target: "svc2", value: 1 },

                { source: "table4", target: "svc2", value: 1 },
                { source: "table5", target: "svc2", value: 1 },
                { source: "table6", target: "svc2", value: 1 },
                { source: "table7", target: "svc2", value: 1 },
                { source: "table8", target: "svc2", value: 1 },
                { source: "table9", target: "svc2", value: 1 },
                { source: "table10", target: "svc2", value: 1 },
                { source: "table11", target: "svc2", value: 1 },
                { source: "table12", target: "svc2", value: 1 },
                { source: "table13", target: "svc2", value: 1 },
                { source: "table14", target: "svc2", value: 1 },
                { source: "table15", target: "svc2", value: 1 },

                { source: "table4", target: "batch2", value: 1 },
                { source: "table5", target: "batch2", value: 1 },
                { source: "table6", target: "batch2", value: 1 },
                { source: "table7", target: "batch2", value: 1 },
                { source: "table8", target: "batch2", value: 1 },
                { source: "table9", target: "batch2", value: 1 },
                { source: "table10", target: "batch2", value: 1 },
                { source: "table11", target: "batch2", value: 1 },
                { source: "table12", target: "batch2", value: 1 },
                { source: "table13", target: "batch2", value: 1 },
                { source: "table14", target: "batch2", value: 1 },
                { source: "table15", target: "batch2", value: 1 },

                { source: "web4", target: "svc2", value: 1 },
                { source: "web5", target: "svc2", value: 1 },
                { source: "web6", target: "svc2", value: 1 },
                { source: "web7", target: "svc2", value: 1 },
                { source: "web8", target: "svc2", value: 1 },
                { source: "web8", target: "svc1", value: 1 },
                { source: "web9", target: "svc2", value: 1 },
                { source: "web10", target: "svc2", value: 1 },


            ]
        }

        function buildSvg(selectedElements) {
            var svg = ForceGraph(selectedElements, {
                id: "mySvg",
                nodeId: d => d.id,
                nodeGroup: d => d.group,
                nodeTitle: d => `${d.id}\n${d.group}`,
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

        function listSelectedConnectors() {
            selectedDataElements.nodes.forEach((element, index, array) => {
                if (element.id.includes("table")) {
                    $("#tables").append(element.id);
                    $("#tables").append("<br>");
                }

                if (element.id.includes("svc")) {
                    $("#svc").append(element.id);
                    $("#svc").append("<br>");
                }

                if (element.id.includes("web")) {
                    $("#web").append(element.id);
                    $("#web").append("<br>");
                }

                if (element.id.includes("batch")) {
                    $("#batch").append(element.id);
                    $("#batch").append("<br>");
                }

            });
        }

        function checkNodes(newDataElements, nodename){
            var found = false;
            newDataElements.nodes.forEach((node, index2, array2) => {
                if (node.id===nodename){
                    found = true;
                }
            });
            return found;
        }

        function resetSvg(){
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

            dataelements.links.forEach((element, index, array) => {
                if (element.source === sval || element.target === sval){
                    dataelements.nodes.forEach((subElement, index2, array2) => {
                        if(subElement.id === element.target || subElement.id === element.source){
                            if(!(checkNodes(newDataElements, subElement.id))){
                                newDataElements.nodes.push(subElement);
                            }
                        }
                    });
                    newDataElements.links.push(element);
                }
            });
            
            selectedDataElements = newDataElements;
            var svg = buildSvg(selectedDataElements);
            $("#container").html(svg);
            listSelectedConnectors();
            
        }
