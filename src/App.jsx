import React, { useState } from 'react';
import { NestedTable } from './NestedTable';

const initialData = [
  { name: 'Sales', verticalLevel:2, color: 'white', parrent: 'NO' },
  { name: 'Costs', verticalLevel: 3, color: 'red', parrent: 'Sales' },
  { name: 'Net Income', verticalLevel: 1, color: 'green', parrent: 'NO' }
];

const initialAdditionalData = localStorage.getItem('reports') ? JSON.parse(localStorage.getItem('reports')) : [
  { sales: 3, costs: -1, netincome: 2 },
  { sales: 5, costs: -1 }
];

const transformData = (input, additionalData) => {
  const idMap = {};
  const rootNodes = [];

  input.forEach((item, index) => {
    const node = {
      id: index + 1,
      name: item.name,
      color: item.color,
      children: [],
      additionalValues: additionalData.map((data) => data[item.name.toLowerCase().replace(' ', '')] || 'EMPTY')
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
  rootNodes.sort((a,b) => {
    return a.verticalLevel - b.verticalLevel
  })
  return rootNodes;
};



const App = () => {
  const [data, setData] = useState(initialData);
  const [additionalData, setAdditionalData] = useState(initialAdditionalData);

  const handleAddItem = (newItem) => {
    setData((prev) => [...prev, newItem]);
  };

  const handleUpdateItem = (id, newName) => {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name: newName } : item))
    );
  };

  const removeReport = (index) => {
    setAdditionalData((reports) => {
      let tempReports = reports.filter((rep,i) => {
        return i != index
      })

      localStorage.setItem('reports', JSON.stringify(tempReports))

      return tempReports
    })
  }

  const handleAddAdditionalData = (newData) => {

    setAdditionalData((prev) => {
      let temp = [...prev, newData]
      localStorage.setItem('reports', JSON.stringify(temp))
      return temp
    });
  };

  const handleEditAdditionalValue = (nodeId, index, newValue) => {
    setAdditionalData((prev) =>{
      let temp = [...prev];
      temp[index][Object.keys(additionalData[0])[nodeId-1]] = newValue;
      localStorage.setItem('reports', JSON.stringify(temp))

      return temp;
    });
  };
  
  
  const additionalDataKeys = Object.keys(initialAdditionalData[0]);
  const nestedData = transformData(data, additionalData);

  return (
    <div>
      <h1>Nested Table</h1>
      <NestedTable 
        nodes={nestedData} 
        onAdd={handleAddItem} 
        onUpdate={handleUpdateItem} 
        onAddAdditionalData={handleAddAdditionalData} 
        onEditAdditionalValue={handleEditAdditionalValue}
        additionalDataKeys={additionalDataKeys}
        reports={additionalData}
        removeReport={removeReport}
      />
    </div>
  );
};

export default App; 