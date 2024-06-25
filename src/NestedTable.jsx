import {useState} from 'react'
import React from 'react'

export const NestedTable = ({ nodes, onAdd, onUpdate }) => {
  const [expandedNodes, setExpandedNodes] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    verticalLevel: 0,
    color: '',
    parrent: 'NO'
  });
  const [editingNode, setEditingNode] = useState(null);
  const [editName, setEditName] = useState('');

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

  const handleNameClick = (node) => {
    setEditingNode(node.id);
    setEditName(node.name);
  };

  const handleEditNameChange = (e) => {
    setEditName(e.target.value);
  };

  const handleEditNameSubmit = (node) => {
    onUpdate(node.name, editName);
    setEditingNode(null);
  };

  const renderNodes = (nodes, level) => {
    return nodes.map((node) => (
      <React.Fragment key={node.id}>
        <div style={{ paddingLeft: `${level * 20}px`, display: 'flex', alignItems: 'center', background:node.color }}>
          {node.children.length > 0 && (
            <span style={{ cursor: 'pointer' }} onClick={() => toggleNode(node.id)}>
              {expandedNodes[node.id] ? '-' : '+'}
            </span>
          )}
          {editingNode === node.id ? (
              <input
                type="text"
                value={editName}
                onChange={handleEditNameChange}
                onBlur={() => {
                  handleEditNameSubmit(node, editName);

                  setEditingNode(null);
                }}
              autoFocus
            />
          ) : (
            <span style={{ cursor: 'pointer' }} onClick={() => handleNameClick(node)}>
              {node.name}
            </span>
          )}
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
      <h2>Add New Item</h2>
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
      </form>
    </div>
  );
};