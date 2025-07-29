"use client";

import React, { useState } from 'react';


const InteractiveMLModel = () => {
  const [inputValues, setInputValues] = useState({
    age: 30,
    income: 50000,
    creditScore: 700,
    loanAmount: 200000
  });
  type Prediction = {
  approved: boolean;
  probability: number;
  riskScore: number;
  debtToIncomeRatio: number;
  factors: Record<string, string>;
} | null;
const [prediction, setPrediction] = useState<Prediction>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate a trained ML model for loan approval prediction
  const predictLoanApproval = (features: typeof inputValues) => {
    // Simple rule-based model simulation (in reality, this would be a trained model)
    const { age, income, creditScore, loanAmount } = features;
    
    // Calculate debt-to-income ratio
    const debtToIncomeRatio = (loanAmount * 0.05) / (income / 12); // Assuming 5% interest monthly payment
    
    // Risk scoring algorithm
    let riskScore = 0;
    
    // Age factor (25-65 is optimal)
    if (age >= 25 && age <= 65) riskScore += 20;
    else if (age >= 18 && age < 25) riskScore += 10;
    else riskScore += 5;
    
    // Credit score factor
    if (creditScore >= 750) riskScore += 30;
    else if (creditScore >= 700) riskScore += 25;
    else if (creditScore >= 650) riskScore += 15;
    else if (creditScore >= 600) riskScore += 10;
    else riskScore += 0;
    
    // Income factor
    if (income >= 80000) riskScore += 25;
    else if (income >= 60000) riskScore += 20;
    else if (income >= 40000) riskScore += 15;
    else if (income >= 30000) riskScore += 10;
    else riskScore += 5;
    
    // Debt-to-income ratio factor
    if (debtToIncomeRatio <= 0.28) riskScore += 25;
    else if (debtToIncomeRatio <= 0.36) riskScore += 15;
    else if (debtToIncomeRatio <= 0.43) riskScore += 10;
    else riskScore += 0;
    
    const approvalProbability = Math.min(riskScore / 100, 0.95);
    const approved = approvalProbability >= 0.6;
    
    return {
      approved,
      probability: approvalProbability,
      riskScore,
      debtToIncomeRatio,
      factors: {
        creditScore: creditScore >= 700 ? 'Good' : creditScore >= 650 ? 'Fair' : 'Poor',
        income: income >= 60000 ? 'High' : income >= 40000 ? 'Medium' : 'Low',
        debtRatio: debtToIncomeRatio <= 0.28 ? 'Low Risk' : debtToIncomeRatio <= 0.36 ? 'Medium Risk' : 'High Risk'
      }
    };
  };

  const handlePredict = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = predictLoanApproval(inputValues);
    setPrediction(result);
    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: number) => {
    setInputValues(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear prediction when inputs change
    setPrediction(null);
  };

  return (
    <section id="ml-model" className="section">
      <h2>Interactive ML Model: Loan Approval Predictor</h2>
      <p>A machine learning model that predicts loan approval based on applicant data. Adjust the parameters and see real-time predictions.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Input Panel */}
        <div>
          <h4>Applicant Information</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Age: {inputValues.age}
              </label>
              <input
                type="range"
                min="18"
                max="80"
                value={inputValues.age}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Annual Income: ${inputValues.income.toLocaleString()}
              </label>
              <input
                type="range"
                min="20000"
                max="150000"
                step="5000"
                value={inputValues.income}
                onChange={(e) => handleInputChange('income', parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Credit Score: {inputValues.creditScore}
              </label>
              <input
                type="range"
                min="300"
                max="850"
                step="10"
                value={inputValues.creditScore}
                onChange={(e) => handleInputChange('creditScore', parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Loan Amount: ${inputValues.loanAmount.toLocaleString()}
              </label>
              <input
                type="range"
                min="50000"
                max="500000"
                step="10000"
                value={inputValues.loanAmount}
                onChange={(e) => handleInputChange('loanAmount', parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>
          
          <button
            onClick={handlePredict}
            disabled={isLoading}
            style={{
              marginTop: '20px',
              padding: '12px 24px',
              backgroundColor: isLoading ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              width: '100%'
            }}
          >
            {isLoading ? 'Analyzing...' : 'Predict Loan Approval'}
          </button>
        </div>

        {/* Prediction Panel */}
        <div>
          <h4>Model Prediction</h4>
          {isLoading && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '18px', color: '#007bff' }}>🤖 AI Model Processing...</div>
              <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                Analyzing risk factors and calculating approval probability
              </div>
            </div>
          )}
          
          {prediction && !isLoading && (
            <div style={{ 
              padding: '20px', 
              backgroundColor: prediction.approved ? '#d4edda' : '#f8d7da',
              borderRadius: '8px',
              border: `2px solid ${prediction.approved ? '#28a745' : '#dc3545'}`
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
                {prediction.approved ? '✅ APPROVED' : '❌ DENIED'}
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <strong>Approval Probability:</strong> {(prediction.probability * 100).toFixed(1)}%
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <strong>Risk Score:</strong> {prediction.riskScore}/100
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <strong>Debt-to-Income Ratio:</strong> {(prediction.debtToIncomeRatio * 100).toFixed(1)}%
              </div>
              
              <div>
                <strong>Risk Factors Analysis:</strong>
                <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
                  <li>Credit Score: {prediction.factors.creditScore}</li>
                  <li>Income Level: {prediction.factors.income}</li>
                  <li>Debt Risk: {prediction.factors.debtRatio}</li>
                </ul>
              </div>
            </div>
          )}
          
          {!prediction && !isLoading && (
            <div style={{ 
              padding: '40px', 
              textAlign: 'center', 
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              color: '#666'
            }}>
              Adjust the parameters and click &quot;Predict&quot; to see the model&#39;s analysis
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h4>Model Architecture & Features:</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <strong>Input Features:</strong>
            <ul>
              <li>Applicant Age</li>
              <li>Annual Income</li>
              <li>Credit Score</li>
              <li>Requested Loan Amount</li>
            </ul>
          </div>
          <div>
            <strong>Model Techniques:</strong>
            <ul>
              <li>Feature Engineering (Debt-to-Income Ratio)</li>
              <li>Risk Scoring Algorithm</li>
              <li>Multi-factor Decision Tree Logic</li>
              <li>Probability Calibration</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveMLModel;
