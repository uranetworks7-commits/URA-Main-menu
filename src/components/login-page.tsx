'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface LoginPageProps {
  onLogin: (name: string, mainAccountUsername: string) => void;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  mainAccountUsername: z.string().min(2, {
    message: "Main account username must be at least 2 characters.",
  }),
});


export function LoginPage({ onLogin }: LoginPageProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      mainAccountUsername: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onLogin(values.name, values.mainAccountUsername);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
                 <svg className="h-10 w-10 text-primary" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 20 20 L 80 80" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                    <path d="M 80 20 L 20 80" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                </svg>
                  <h1 className="text-3xl font-bold text-primary">URA-X</h1>
            </div>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to log in</CardDescription>
        </CardHeader>
        <CardContent>
           <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Username</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. JohnDoe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mainAccountUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main Account Username</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. MainAccount" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Login</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
