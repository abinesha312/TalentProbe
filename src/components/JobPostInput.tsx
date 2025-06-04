import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileText, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateSurveyQuestions } from '@/services/questionGenerator';

interface JobPostInputProps {
  jobPost: string;
  setJobPost: (value: string) => void;
  onQuestionsGenerated: (questions: string[]) => void;
}

const JobPostInput: React.FC<JobPostInputProps> = ({ 
  jobPost, 
  setJobPost, 
  onQuestionsGenerated 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setJobPost(content);
          toast({
            title: "File uploaded successfully",
            description: "Job post content has been loaded.",
          });
        };
        reader.readAsText(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a text file (.txt)",
          variant: "destructive",
        });
      }
    }
  };

  const handleGenerateQuestions = async () => {
    if (!jobPost.trim()) {
      toast({
        title: "No job post content",
        description: "Please enter or upload a job post first.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      console.log("Generating questions for job post:", jobPost.substring(0, 100) + "...");
      const questions = await generateSurveyQuestions(jobPost);
      onQuestionsGenerated(questions);
      toast({
        title: "Questions generated successfully!",
        description: `Generated ${questions.length} personalized survey questions.`,
      });
    } catch (error) {
      console.error("Error generating questions:", error);
      toast({
        title: "Generation failed",
        description: "Failed to generate questions. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* File Upload Option */}
      <Card className="border-2 border-dashed border-slate-600/30 bg-slate-800/20 
                       hover:border-blue-500/50 hover:bg-blue-900/10 hover:shadow-xl hover:shadow-blue-500/5
                       transition-all duration-500 backdrop-blur-sm cursor-pointer group">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-slate-700/50 rounded-full flex items-center justify-center mb-6 
                            group-hover:bg-blue-600/30 group-hover:shadow-lg group-hover:shadow-blue-500/20
                            transition-all duration-300">
              <Upload className="h-8 w-8 text-slate-300 group-hover:text-blue-300 transition-colors duration-300" />
            </div>
            <div className="mb-4">
              <Label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-slate-200 group-hover:text-blue-200 font-medium text-lg transition-colors duration-300">
                  Upload a job post file
                </span>
                <span className="text-slate-400/70 group-hover:text-blue-300/70 transition-colors duration-300"> or drag and drop</span>
              </Label>
              <Input
                id="file-upload"
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            <p className="text-sm text-slate-400/60 group-hover:text-blue-300/60 transition-colors duration-300">
              TXT files up to 10MB
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Manual Text Input */}
      <div className="space-y-3 group">
        <Label htmlFor="job-post" className="text-slate-200 font-medium flex items-center gap-2 group-hover:text-blue-200 transition-colors duration-300">
          <FileText className="h-4 w-4" />
          Paste your job post content
        </Label>
        <Textarea
          id="job-post"
          placeholder="Paste your job posting here..."
          value={jobPost}
          onChange={(e) => setJobPost(e.target.value)}
          className="min-h-[300px] resize-none bg-slate-800/30 border-slate-600/30 text-slate-100 placeholder:text-slate-400/60
                     hover:bg-slate-800/50 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10
                     focus:border-blue-400 focus:ring-blue-400/20 focus:bg-slate-800/60
                     backdrop-blur-sm transition-all duration-300"
        />
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400/70 group-hover:text-blue-300/70 transition-colors duration-300">
            {jobPost.length} characters
          </span>
          {jobPost && (
            <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">
              <FileText className="h-4 w-4" />
              <span className="font-medium">Job post loaded</span>
            </div>
          )}
        </div>
      </div>

      {/* Generate Button */}
      <Button 
        onClick={handleGenerateQuestions}
        disabled={isGenerating || !jobPost.trim()}
        className="w-full bg-gradient-to-r from-slate-700 to-slate-600 
                   hover:from-blue-600 hover:to-blue-500 
                   disabled:from-slate-800 disabled:to-slate-700
                   text-white py-4 text-lg font-semibold 
                   shadow-xl hover:shadow-2xl hover:shadow-blue-500/20
                   transition-all duration-500 transform hover:scale-[1.02]
                   border border-slate-600/30 hover:border-blue-500/50"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-3 h-6 w-6 animate-spin" />
            Generating Questions...
          </>
        ) : (
          <>
            <Sparkles className="mr-3 h-6 w-6" />
            Generate Survey Questions
          </>
        )}
      </Button>
    </div>
  );
};

export default JobPostInput;
