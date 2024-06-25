import {useState} from 'react'
import React from 'react'
export const NestedTable = ({ nodes, onAdd, onUpdate, onAddAdditionalData, additionalDataKeys, onEditAdditionalValue }) => {
  const [expandedNodes, setExpandedNodes] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    verticalLevel: 0,
    color: '',
    parrent: 'NO'
  });
  const [editingNode, setEditingNode] = useState(null);
  const [editName, setEditName] = useState('');
  const [editingValue, setEditingValue] = useState(null);
  const [additionalDataForm, setAdditionalDataForm] = useState(
    additionalDataKeys.reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
  );

  const toggleNode = (id) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'verticalLevel' ? parseInt(value, 10) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      name: '',
      verticalLevel: 0,
      color: '',
      parrent: 'NO'
    });
  };

  const handleAdditionalDataChange = (e) => {
    const { name, value } = e.target;
    setAdditionalDataForm((prev) => ({
      ...prev,
      [name]: parseInt(value, 10)
    }));
  };

  const handleAdditionalDataSubmit = (e) => {
    e.preventDefault();
    onAddAdditionalData(additionalDataForm);
    setAdditionalDataForm(
      additionalDataKeys.reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
    );
  };

  const handleNameClick = (node) => {
    setEditingNode(node.id);
    setEditName(node.name);
  };

  const handleEditNameChange = (e) => {
    setEditName(e.target.value);
  };

  const handleEditNameSubmit = (e, node) => {
    e.preventDefault();
    onUpdate(node.id, editName);
    setEditingNode(null);
  };

  const handleValueClick = (nodeId, index) => {
    setEditingValue({ nodeId, index });
  };

  const handleValueChange = (e) => {
    setEditName(e.target.value);
  };

  const handleEditValueSubmit = (nodeId, index) => {
    onEditAdditionalValue(nodeId, index, editName);
    setEditingValue(null);
    setEditName('')
  };

  const renderNodes = (nodes, level) => {
    return nodes.map((node) => (
      <React.Fragment key={node.id}>
        <div style={{ paddingLeft: `${level * 20}px`, display: 'flex', alignItems: 'center', backgroundColor:node.color }}>
          {node.children.length > 0 && (
            <span style={{ cursor: 'pointer' }} onClick={() => toggleNode(node.id)}>
              {expandedNodes[node.id] ? '-' : '+'}
            </span>
          )}
          <span style={{ cursor: 'pointer' }}>
            {node.name}
          </span>
          <div style={{ marginLeft: '10px' }}>
            {node.additionalValues.map((value, index) => (
              <span key={index} style={{ marginLeft: '10px', cursor: 'pointer' }} onClick={() => handleValueClick(node.id, index)}>
                {editingValue?.nodeId === node.id && editingValue?.index === index ? (
                   <input
                    type="number"
                    value={editName}  
                    onChange={handleValueChange}
                    onBlur={() => {
                      handleEditValueSubmit(node.id, index);
    
                      setEditingValue(null);
                    }}
                    autoFocus
                 />
                ) : (
                  value
                )}
              </span>
            ))}
          </div>
        </div>
        {expandedNodes[node.id] && node.children.length > 0 && (
          <div>{renderNodes(node.children, level + 1)}</div>
        )}
      </React.Fragment>
    ));
  };

  return (
    <div>
      {renderNodes(nodes, 0)}
      {/* <h2>Add New Item</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Vertical Level:</label>
          <input
            type="number"
            name="verticalLevel"
            value={formData.verticalLevel}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Color:</label>
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Parent:</label>
          <input
            type="text"
            name="parrent"
            value={formData.parrent}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Add Item</button>
      </form> */}
      <h2>Add Report</h2>
      <form onSubmit={handleAdditionalDataSubmit}>
        {additionalDataKeys.map((key) => (
          <div key={key}>
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
            <input
              type="number"
              name={key}
              value={additionalDataForm[key]}
              onChange={handleAdditionalDataChange}
              required
            />
          </div>
        ))}
        <button type="submit">Add Report</button>
      </form>
    </div>
  );
};
