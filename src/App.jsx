import { NestedTable } from "./NestedTable";
import { useEffect, useState } from "react";
const initialData = [
  { name: 'Sales', verticalLevel: 0, color: 'white', parrent: 'NO' },
  { name: 'Costs', verticalLevel: 1, color: 'red', parrent: 'Sales' },
  { name: 'Net Income', verticalLevel: 2, color: 'green', parrent: 'NO' }
];

const transformData = (input) => {
  const idMap = {};
  const rootNodes = [];

  input.forEach((item, index) => {
    const node = {
      id: index + 1,
      name: item.name,
      color: item.color,
      children: []
    };
    idMap[item.name] = node;

    if (item.parrent === 'NO') {
      rootNodes.push(node);
    } else {
      const parent = idMap[item.parrent];
      if (parent) {
        parent.children.push(node);
      }
    }
  });

  return rootNodes;
};



const App = () => {
  const [data, setData] = useState(initialData);
  const [nestedData, setNestedData] = useState(transformData(initialData));

  useEffect(() => {
    setNestedData(transformData(data))  
  }, [data])
  const handleAddItem = (newItem) => {
    setData((prev) => [...prev, newItem]);
  };
  const handleUpdateItem = (oldName, newName) => {
    
    setData((prev) =>
      prev.map((item) => (item.name === oldName ? { ...item, name: newName } : item))
    );
    
  };

  return (
    <div>
      <h1>Nested Table</h1>
      <NestedTable nodes={nestedData} onUpdate={handleUpdateItem} onAdd={handleAddItem} />
    </div>
  );
};

export default App;