
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Edit, Save, X, Plus, Trash2 } from 'lucide-react';

interface QuestionGeneratorProps {
  questions: string[];
  jobPost: string;
  onQuestionsUpdated: (questions: string[]) => void;
}

const QuestionGenerator: React.FC<QuestionGeneratorProps> = ({
  questions,
  jobPost,
  onQuestionsUpdated
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const questionCategories = [
    { category: 'Role Clarification', color: 'bg-blue-100 text-blue-800' },
    { category: 'Experience & Skills', color: 'bg-green-100 text-green-800' },
    { category: 'Team & Culture', color: 'bg-purple-100 text-purple-800' },
    { category: 'Additional Context', color: 'bg-orange-100 text-orange-800' }
  ];

  const categorizeQuestion = (question: string, index: number): string => {
    const lowerQuestion = question.toLowerCase();
    if (lowerQuestion.includes('responsibility') || lowerQuestion.includes('role') || lowerQuestion.includes('duties')) {
      return 'Role Clarification';
    } else if (lowerQuestion.includes('experience') || lowerQuestion.includes('skill') || lowerQuestion.includes('qualification')) {
      return 'Experience & Skills';
    } else if (lowerQuestion.includes('team') || lowerQuestion.includes('culture') || lowerQuestion.includes('environment')) {
      return 'Team & Culture';
    }
    return 'Additional Context';
  };

  const getCategoryStyle = (category: string): string => {
    const categoryData = questionCategories.find(cat => cat.category === category);
    return categoryData?.color || 'bg-gray-100 text-gray-800';
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditText(questions[index]);
  };

  const handleSave = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = editText;
    onQuestionsUpdated(updatedQuestions);
    setEditingIndex(null);
    setEditText('');
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditText('');
  };

  const handleDelete = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    onQuestionsUpdated(updatedQuestions);
  };

  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      onQuestionsUpdated([...questions, newQuestion.trim()]);
      setNewQuestion('');
      setShowAddForm(false);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No questions generated yet</h3>
        <p className="text-gray-600">
          Go to the Job Post Input tab to generate survey questions based on your job posting.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Generated Survey Questions ({questions.length})
          </h3>
          <p className="text-sm text-gray-600">
            AI-generated questions to gather additional context from recruiters
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Question
        </Button>
      </div>

      {/* Add New Question Form */}
      {showAddForm && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <Textarea
                placeholder="Enter your custom survey question..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="bg-white"
              />
              <div className="flex gap-2">
                <Button onClick={handleAddQuestion} size="sm">
                  <Save className="h-4 w-4 mr-1" />
                  Add Question
                </Button>
                <Button 
                  onClick={() => {
                    setShowAddForm(false);
                    setNewQuestion('');
                  }} 
                  variant="outline" 
                  size="sm"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((question, index) => {
          const category = categorizeQuestion(question, index);
          const isEditing = editingIndex === index;

          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={getCategoryStyle(category)}>
                      {category}
                    </Badge>
                    <span className="text-sm text-gray-500">Question {index + 1}</span>
                  </div>
                  <div className="flex gap-1">
                    {!isEditing && (
                      <>
                        <Button
                          onClick={() => handleEdit(index)}
                          variant="ghost"
                          size="sm"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-3">
                    <Textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex gap-2">
                      <Button onClick={() => handleSave(index)} size="sm">
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button onClick={handleCancel} variant="outline" size="sm">
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 leading-relaxed">{question}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Category Summary */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-sm">Question Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {questionCategories.map((cat) => {
              const count = questions.filter((q, i) => categorizeQuestion(q, i) === cat.category).length;
              return (
                <div key={cat.category} className="flex items-center gap-2">
                  <Badge variant="secondary" className={cat.color}>
                    {cat.category}
                  </Badge>
                  <span className="text-sm text-gray-600">({count})</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionGenerator;
