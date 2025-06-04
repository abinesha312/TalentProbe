
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, MessageSquare, Mic, Upload, Brain } from 'lucide-react';
import JobPostInput from '@/components/JobPostInput';
import VoiceInterviewer from '@/components/VoiceInterviewer';
import QuestionGenerator from '@/components/QuestionGenerator';

const Index = () => {
  const [jobPost, setJobPost] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('input');

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-800 via-slate-800 to-black">
      {/* Header */}
      <header className="bg-gradient-to-r from-black/80 to-slate-900/80 backdrop-blur-sm border-b border-blue-500/20 shadow-xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl shadow-lg border border-blue-500/30 backdrop-blur-sm">
              <Brain className="h-8 w-8 text-blue-300" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-blue-200 bg-clip-text text-transparent">
                TalentProbe
              </h1>
              <p className="text-slate-300/80 text-sm font-medium">
                Intelligent Survey Generation for Modern Recruiters
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-200 via-blue-200 to-slate-200 bg-clip-text text-transparent">
                Transform Job Posts into
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300 bg-clip-text text-transparent">
                Intelligent Conversations
              </span>
            </h2>
            <p className="text-xl text-slate-300/80 max-w-4xl mx-auto leading-relaxed">
              Upload your job posting and let our AI generate personalized survey questions, 
              then engage in a voice conversation to gather deeper insights about your ideal candidate.
            </p>
          </div>

          {/* Tabs Section */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 bg-black/60 backdrop-blur-sm border border-blue-500/30 shadow-xl p-2 rounded-xl h-auto">
              <TabsTrigger 
                value="input" 
                className="flex items-center justify-center gap-3 text-slate-300 px-6 py-4
                          data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/80 data-[state=active]:to-blue-500/80 
                          data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/20
                          hover:bg-blue-600/10 hover:text-blue-200
                          rounded-lg font-medium transition-all duration-300 min-h-[60px]"
              >
                <Upload className="h-5 w-5" />
                <span className="text-sm md:text-base">Job Post Input</span>
              </TabsTrigger>
              <TabsTrigger 
                value="questions" 
                className="flex items-center justify-center gap-3 text-slate-300 px-6 py-4
                          data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/80 data-[state=active]:to-blue-500/80 
                          data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/20
                          hover:bg-blue-600/10 hover:text-blue-200
                          rounded-lg font-medium transition-all duration-300 min-h-[60px]"
              >
                <MessageSquare className="h-5 w-5" />
                <span className="text-sm md:text-base">Generated Questions</span>
              </TabsTrigger>
              <TabsTrigger 
                value="interview" 
                className="flex items-center justify-center gap-3 text-slate-300 px-6 py-4
                          data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/80 data-[state=active]:to-blue-500/80 
                          data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/20
                          hover:bg-blue-600/10 hover:text-blue-200
                          rounded-lg font-medium transition-all duration-300 min-h-[60px]"
              >
                <Mic className="h-5 w-5" />
                <span className="text-sm md:text-base">Voice Interview</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="input" className="space-y-6">
              <Card className="bg-black/40 backdrop-blur-sm border border-blue-500/20 shadow-2xl 
                               hover:shadow-blue-500/10 transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-black/60 to-slate-900/60 rounded-t-lg border-b border-blue-500/20">
                  <CardTitle className="text-2xl text-slate-100">Job Post Analysis</CardTitle>
                  <CardDescription className="text-slate-300/70">
                    Paste your job posting or upload a document to begin generating intelligent survey questions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <JobPostInput 
                    jobPost={jobPost} 
                    setJobPost={setJobPost}
                    onQuestionsGenerated={(questions) => {
                      setGeneratedQuestions(questions);
                      setActiveTab('questions');
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="questions" className="space-y-6">
              <Card className="bg-black/40 backdrop-blur-sm border border-blue-500/20 shadow-2xl 
                               hover:shadow-blue-500/10 transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-black/60 to-slate-900/60 rounded-t-lg border-b border-blue-500/20">
                  <CardTitle className="text-2xl text-slate-100">AI-Generated Survey Questions</CardTitle>
                  <CardDescription className="text-slate-300/70">
                    Review and customize the questions generated based on your job posting.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <QuestionGenerator 
                    questions={generatedQuestions}
                    jobPost={jobPost}
                    onQuestionsUpdated={setGeneratedQuestions}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="interview" className="space-y-6">
              <Card className="bg-black/40 backdrop-blur-sm border border-blue-500/20 shadow-2xl 
                               hover:shadow-blue-500/10 transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-black/60 to-slate-900/60 rounded-t-lg border-b border-blue-500/20">
                  <CardTitle className="text-2xl text-slate-100">Voice AI Interview</CardTitle>
                  <CardDescription className="text-slate-300/70">
                    Engage in a conversation with our AI to dive deeper into your recruitment needs.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <VoiceInterviewer 
                    questions={generatedQuestions}
                    jobPost={jobPost}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Index;
