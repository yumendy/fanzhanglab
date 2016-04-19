/**
 * Created by yumendy on 2016/4/15.
 */

function draw_graph_graph(canvas_id, graph) {
    var categories_name = ['normal', 'approved drug target from DrugBank', 'compound target from DrugBank'];
    var categories = categories_name.map(function (name) {
        return {name: name}
    });
    graph.nodes.forEach(function (node) {
        node.symbolSize = 15;
        node.x = node.y = null;
        // node.draggable = true;
        // node.category = node.color;
        node.label = {
            normal: {
                show: true
            }
        };
        function get_color(color_string) {
            switch(color_string) {
                case "white":
                    return '#ffffff';
                case "orange":
                    return '#8a6d3b';
                case "green":
                    return '#3c763d';
                case "red":
                    return '#a94442';
                default:
                    return '#ffffff';
            }
        }
        function get_category(color_string) {
            switch (color_string) {
                case "white":
                    return 'normal';
                case "orange":
                    return 'compound target from DrugBank';
                case "red":
                    return 'approved drug target from DrugBank';
                default:
                    return 'normal';
            }
        }
        node.itemStyle = {
            normal:{
                color: get_color(node.color)
            }
        };
        node.category = get_category(node.color)
    });
    var chart = echarts.init(document.getElementById(canvas_id));
    var option = {
        title: {},
        tooltip: {},
        legend: [{
            data: categories.map(function (item) {
                return item.name;
            }),
            bottom:'10%'
        }],
        animationDuration: 1500,
        animationEasingUpdate: 'quinticInOut',
        backgroundColor: '#ffffff',
        series: [
            {
                type: "graph",
                layout: "force",
                force: {
                    repulsion: 100,
                    edgeLength: 50
                },
                data:graph.nodes,
                links: graph.links,
                roam: true,
                categories: categories,
                label: {
                    normal: {
                        position: 'right',
                        formatter: '{b}',
                        textStyle: {
                            color: "#000000"
                        }
                    }
                },
                lineStyle: {
                    normal: {
                        curveness: 0.1
                    }
                },
                itemStyle: {
                    normal: {
                        borderColor: '#000000',
                        borderWidth: 1
                    }
                }
            }
        ]
    };
    chart.setOption(option);
}

function draw_bar_graph(canvas_id, bar) {
    var chart = echarts.init(document.getElementById(canvas_id));
    var option = {
        backgroundColor: '#ffffff',
        animationDuration: 1500,
        animationEasingUpdate: 'quinticInOut',
        grid:{
            top:'10%',
            containLabel:true
        },
        tooltip:{},
        xAxis: {
            data:bar.x,
            axisLabel:{
                interval: 0,
                rotate:30,
                textStyle:{
                    fontSize:6
                }
            }
        },
        yAxis: {},
        series: [{
            type: 'bar',
            data: bar.y
        }]
    };
    chart.setOption(option);
}

function add_group(parent_node_id, group) {
    var template_string = '\
    <div class="container-fluid group-header"> \
        <div class="row"> \
            <div class="col-md-2 col-md-offset-1"> \
                <h4 class="group-header-title text-center">GROUP: <%=group_id%></h4> \
            </div> \
            <div class="col-md-8 group-header-text"> \
                <p><strong>DESCRIPTION:</strong> <%=group_description%></p> \
                <p><strong>MEMBERS:</strong><%=group_members%></p> \
            </div> \
        </div> \
    </div> \
    <div class="container group-graph"> \
        <div class="row"> \
            <div class="col-md-6 col-xs-12 graph-area"><div id="<%=group_id%>-graph" style="height: 320px; width: 505px"></div></div> \
            <div class="col-md-6 col-xs-12 graph-area"><div id="<%=group_id%>-bar" style="height: 320px; width: 505px"></div></div> \
        </div> \
    </div> \
        ';

    var members_list = [];
    group.graph.nodes.forEach(function (node) {
        members_list.push(node.name)
    });
    var inner_content = template(template_string, {
        group_id: group.id,
        group_description: group.description,
        group_members: members_list.join(', ')
    });
    $(parent_node_id).append(inner_content);

    draw_graph_graph(group.id + '-graph', group.graph);
    draw_bar_graph(group.id + '-bar', group.bar)
}
