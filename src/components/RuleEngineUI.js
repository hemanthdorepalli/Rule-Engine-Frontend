import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import Checkbox from './ui/Checkbox';
import { Play, Trash2 } from 'lucide-react';

const API_BASE_URL = 'https://ats-ruleengine-backend.onrender.com/api/rules';

const RuleEngine = () => {
  const [rules, setRules] = useState([]);
  const [newRule, setNewRule] = useState('');
  const [evaluationData, setEvaluationData] = useState({
    age: '',
    salary: '',
    department: '',
    experience: ''
  });
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [selectedRules, setSelectedRules] = useState({});
  const [createRuleError, setCreateRuleError] = useState(null);
  const [combineRulesError, setCombineRulesError] = useState(null);
  const [evaluateRuleError, setEvaluateRuleError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingRules, setLoadingRules] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    setLoadingRules(true);
    try {
      const response = await fetch(API_BASE_URL);
      const data = await response.json();
      setRules(data);
    } catch (error) {
      console.error('Error fetching rules:', error);
    } finally {
      setLoadingRules(false);
    }
  };

  const handleCreateRule = async () => {
    setCreateRuleError(null);

    if (!validateRuleString(newRule)) {
      setCreateRuleError('Invalid rule format. Please check for missing operators or syntax issues.');
      return;
    }

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ruleString: newRule }),
      });
      if (response.ok) {
        const createdRule = await response.json();
        setRules([...rules, createdRule]);
        setNewRule('');
      } else {
        setCreateRuleError('Error creating rule. Please try again.');
      }
    } catch (error) {
      console.error('Error creating rule:', error);
      setCreateRuleError('Error creating rule. Please try again.');
    }
  };

  const handleCombineRules = async () => {
    setCombineRulesError(null);

    const selectedRuleStrings = Object.keys(selectedRules)
      .filter(index => selectedRules[index])
      .map(index => rules[index].ruleString);

    if (selectedRuleStrings.length < 2) {
      setCombineRulesError('Select at least two rules to combine.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/combine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedRuleStrings),
      });

      if (response.ok) {
        const combinedRule = await response.json();
        setRules([...rules, combinedRule]);
        setSelectedRules({});
      } else {
        setCombineRulesError('Error combining rules. Please try again.');
      }
    } catch (error) {
      console.error('Error combining rules:', error);
      setCombineRulesError('Error combining rules. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRule = async (ruleId) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      setDeleting(true);
      try {
        const response = await fetch(`${API_BASE_URL}/rules/${ruleId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setRules(rules.filter(rule => rule.id !== ruleId));
        } else {
          alert('Error deleting rule. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting rule:', error);
        alert('Error deleting rule. Please try again.');
      } finally {
        setDeleting(false);
      }
    }
  };

  const evaluateRules = async () => {
    setEvaluateRuleError(null);
    setEvaluating(true);
    try {
      const response = await fetch(`${API_BASE_URL}/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: parseInt(evaluationData.age),
          salary: parseFloat(evaluationData.salary),
          department: evaluationData.department,
          experience: parseInt(evaluationData.experience)
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setEvaluationResult(result.matches);
      } else {
        setEvaluateRuleError('Error evaluating rules. Please try again.');
      }
    } catch (error) {
      console.error('Error evaluating rules:', error);
      setEvaluateRuleError('Error evaluating rules. Please try again.');
    } finally {
      setEvaluating(false);
    }
  };

  const validateRuleString = ruleString => {
    const operators = ['==', '!=', '>', '<', '>=', '<='];
    const logicalOperators = ['AND', 'OR', 'NOT'];
    return operators.some(op => ruleString.includes(op)) &&
           logicalOperators.some(op => ruleString.includes(op));
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Rule Engine</h1>

      {/* Create Rule Section */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Rule</CardTitle>
        </CardHeader>
        <div className="px-4 text-gray-500" style={{ color: '#A0A0A0' }}>
          <p>Example:</p>
          <ul>
            <li>
              <strong>rule1:</strong> {"((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)"}
            </li>
            <li>
              <strong>rule2:</strong> {"((age > 30 AND department = 'Marketing')) AND (salary > 20000 OR experience > 5)"}
            </li>
          </ul>
        </div>
        <CardContent>
          <textarea
            value={newRule}
            onChange={(e) => setNewRule(e.target.value)}
            placeholder="Enter rule string"
            className="mb-2 w-full p-2 border rounded"
            rows={4}
          />
          {createRuleError && <p className="text-red-500">{createRuleError}</p>}
          <button
            onClick={handleCreateRule}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create Rule
          </button>
        </CardContent>
      </Card>

     {/* Existing Rules Section */}
<Card>
  <CardHeader>
    <CardTitle>Existing Rules</CardTitle>
  </CardHeader>
  <CardContent>
    {loadingRules ? (
      <p>Loading rules...</p>
    ) : (
      <>
        <ul className="space-y-2">
          {rules.map((rule, index) => (
            <li key={index} className="flex items-center space-x-2">
              <div className="flex items-center space-x-2"> {/* Flex container for inline display */}
                <Checkbox
                  id={`rule-${index}`}
                  checked={selectedRules[index] || false}
                  onCheckedChange={checked =>
                    setSelectedRules({ ...selectedRules, [index]: checked })
                  }
                  label={rule.ruleString}
                />
                <Trash2 
                onClick={() => handleDeleteRule(rule.id)}
                className="text-red-500 hover:text-red-700 cursor-pointer h-4 w-4" // Added cursor-pointer for better UX
                disabled={deleting}
              /> {/* Delete icon */}
                
              </div>
            </li>
          ))}
        </ul>
        {deleting && <p className="text-red-500">Deleting rule...</p>}
        {combineRulesError && <p className="text-red-500">{combineRulesError}</p>}
        {loading ? (
          <p>Combining rules...</p>
        ) : (
          <button 
            onClick={handleCombineRules}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={loading}
          >
            Combine Selected Rules
          </button>
        )}
      </>
    )}
  </CardContent>
</Card>



      {/* Evaluate Rules Section */}
<Card>
  <CardHeader>
    <CardTitle>Evaluate Rules</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <label className="block mb-1" htmlFor="age">Age</label>
        <input
          type="number"
          id="age"
          placeholder="Age"
          value={evaluationData.age}
          onChange={(e) => setEvaluationData({ ...evaluationData, age: e.target.value })}
          className="p-2 border rounded w-full"
        />
      </div>
      <div>
        <label className="block mb-1" htmlFor="salary">Salary</label>
        <input
          type="number"
          id="salary"
          placeholder="Salary"
          value={evaluationData.salary}
          onChange={(e) => setEvaluationData({ ...evaluationData, salary: e.target.value })}
          className="p-2 border rounded w-full"
        />
      </div>
      <div>
        <label className="block mb-1" htmlFor="department">Department</label>
        <input
          id="department"
          placeholder="Department"
          value={evaluationData.department}
          onChange={(e) => setEvaluationData({ ...evaluationData, department: e.target.value })}
          className="p-2 border rounded w-full"
        />
      </div>
      <div>
        <label className="block mb-1" htmlFor="experience">Experience</label>
        <input
          type="number"
          id="experience"
          placeholder="Experience"
          value={evaluationData.experience}
          onChange={(e) => setEvaluationData({ ...evaluationData, experience: e.target.value })}
          className="p-2 border rounded w-full"
        />
      </div>
    </div>
    {evaluateRuleError && <p className="text-red-500">{evaluateRuleError}</p>}
    {evaluating ? (
      <p className="text-yellow-500">Evaluating rules...</p> // Display this message when evaluating
    ) : (
      <button
        onClick={evaluateRules}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={evaluating}
      >
        <Play className="mr-2 h-4 w-4" />
        Evaluate Rules
      </button>
    )}
    {evaluationResult !== null && (
      <div className="mt-4 p-4 bg-gray-100 rounded">
        Result: {evaluationResult ? 'TRUE - Match Rule' : 'FALSE - Does Not Match Rule'}
      </div>
    )}
  </CardContent>
</Card>

    </div>
  );
};

export default RuleEngine;
