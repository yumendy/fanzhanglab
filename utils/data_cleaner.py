import json


class Node(object):
    def __init__(self, name, color='white'):
        self.name = name
        self.color = color

    def to_json_dict(self):
        return {
            "name": self.name,
            "color": self.color
        }


class Graph(object):
    def __init__(self, graph_id, graph_members_string, description):
        self.graph_id = graph_id
        self.node_list = map(lambda name: Node(name), graph_members_string.split(','))
        self.description = description
        self.edge_list = []
        self.x = []
        self.y = []

    def to_json_dict(self):
        return {
            "id": self.graph_id,
            "description": self.description,
            "graph": {
                "nodes": map(lambda node: node.to_json_dict(), self.node_list),
                "links": map(lambda edge: {"source": edge[0], "target": edge[1]}, self.edge_list)
            },
            "bar": {
                "x": self.x,
                "y": self.y
            }
        }


class DataCleaner(object):
    def __init__(self, gene_name):
        self.gene_name = gene_name
        with open(self.gene_name + '_subnetworks_gene_info.txt') as fp:
            self.graph_list = map(lambda line: Graph(*tuple(line.split('\t'))), fp.readlines())
        with open(self.gene_name + '_comps_selected_featrues_with_prop.txt') as fp:
            temp = fp.readlines()
            sum_list = zip(
                map(lambda line: line.split(), temp[::2]),
                map(lambda a: map(int, a), map(lambda line: line.split(), temp[1::2])),
            )
            for graph, x_y_group in zip(self.graph_list, sum_list):
                graph.x, graph.y = x_y_group
        with open(self.gene_name + '_subnetwork_gene_pair_relations.txt') as fp:
            self.edge_list = map(lambda edge: tuple(edge.split()), fp.readlines())
        for graph in self.graph_list:
            for node in graph.node_list:
                for edge in self.edge_list:
                    if node.name == edge[0]:
                        graph.edge_list.append(edge)

        self.node_dict = {}
        for graph in self.graph_list:
            for node in graph.node_list:
                self.node_dict[node.name] = node

        with open(self.gene_name + '_node_color.txt') as fp:
            node_color_pair = map(lambda line: tuple(line.split()), fp.readlines())
        for item in node_color_pair:
            try:
                self.node_dict[item[0]].color = item[1]
            except KeyError:
                pass

    def to_json_dict(self):
        return map(lambda graph: graph.to_json_dict(), self.graph_list)


if __name__ == '__main__':
    gene_name = raw_input("please input the name of gene:")
    data_cleaner = DataCleaner(gene_name)
    json_string = json.dumps(data_cleaner.to_json_dict())
    with open(gene_name + '.json', 'w') as json_fp:
        json_fp.write(json_string)
