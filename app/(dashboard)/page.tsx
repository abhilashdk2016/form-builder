import { GetForms, GetFormStats } from "@/actions/form";
import CreateFormButton from "@/components/CreateFormButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Form } from "@prisma/client";
import { formatDistance } from "date-fns";
import { LucideView } from "lucide-react";
import Link from "next/link";
import { ReactNode, Suspense } from "react";
import { FaWpforms, FaEdit } from 'react-icons/fa';
import { HiCursorClick } from 'react-icons/hi';
import { TbArrowBounce } from 'react-icons/tb';
import { BiRightArrowAlt } from 'react-icons/bi';
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();
  if(!user) {
    return <div className="pt-4 mx-auto w-[10%] flex items-center">
      <Button asChild variant={"outline"} className="mt-2 text-md bg-black text-white dark:bg-white dark:text-black flex justify-center items-center hover:text-black">
        <Link href={"/sign-in"}>
          <span>Sign In</span>
        </Link>
      </Button>
    </div>
  }
  return (
    <div className="container pt-4 mx-auto">
      <Suspense fallback={<StatsCards loading={true} />}>
        <CardStatsWrapper />
      </Suspense>
      <Separator className="my-6" />
      <h2 className="text-4xl font-bold col-span-2">Your forms</h2>
      <Separator className="my-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CreateFormButton />
        <Suspense fallback={<FormCardSkeleton />}>
          <FormCards />
        </Suspense>
      </div>
    </div>
  );
}


async function CardStatsWrapper() {
  const stats = await GetFormStats();
  return <StatsCards loading={false} data={stats} />
}

interface StatsCardsProps {
  data?: Awaited<ReturnType<typeof GetFormStats>>;
  loading: boolean;
}

function StatsCards(props: StatsCardsProps) {
  const { loading, data } = props;

  return <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
    <StatsCard 
      title="Total Visits" 
      icon={<LucideView className="text-blue-600" />} 
      helperText="All time for visits" 
      value={data?.visits.toLocaleString() || ""} 
      loading={loading} 
      className="shadow-md shadow-yellow-600" />
    <StatsCard 
      title="Total submissions" 
      icon={<FaWpforms className="text-purple-600" />} 
      helperText="All time form submissions" 
      value={data?.submissions.toLocaleString() || ""} 
      loading={loading} 
      className="shadow-md shadow-purple-600" />
    <StatsCard 
      title="Submission Rate" 
      icon={<HiCursorClick className="text-green-600" />} 
      helperText="Visits that result in form submission" 
      value={data?.submissionRate.toLocaleString() + "%" || ""} 
      loading={loading} 
      className="shadow-md shadow-green-600" />
    <StatsCard 
      title="Bounce rate" 
      icon={<TbArrowBounce className="text-red-600" />} 
      helperText="Visits that leaves without interacting" 
      value={data?.bounceRate.toLocaleString() + "%" || ""} 
      loading={loading} 
      className="shadow-md shadow-red-600" />
  </div>
}

interface StatsCardProps {
  title: string;
  icon: ReactNode,
  helperText: string;
  value: string;
  loading: boolean;
  className: string
}

export function StatsCard(props: StatsCardProps) {
  const { title, icon, helperText, value, loading, className } = props;
  return <Card className={className}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {
          loading && <Skeleton><span className="opacity-0">0</span></Skeleton>
        }
        {!loading && value}
      </div>
      <p className="text-xs text-muted-foreground pt-1">{helperText}</p>
    </CardContent>
  </Card>
}

function FormCard({ form }: { form: Form }) {
  return <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2 justify-between">
        <span className="truncate font-bold">{form.name}</span>
        {form.published && <Badge>Published</Badge>}
        {!form.published && <Badge variant={"destructive"}>Draft</Badge>}
      </CardTitle>
      <CardDescription className="fkex items-center justify-between text-muted-foreground text-sm">
        {formatDistance(form.createdAt, new Date(), { addSuffix: true })}
        {form.published && <span className="flex items-center gap-2">
          <LucideView className="text-muted-foreground" />
          <span>{form.visits.toLocaleString()}</span>
          <FaWpforms className="text-muted-foreground" />
          <span>{form.submissions.toLocaleString()}</span>
        </span>}
      </CardDescription>
    </CardHeader>
    <CardContent className="h-[20px] truncate text-sm text-muted-foreground">
      {
        form.description || "No description"
      }
    </CardContent>
    <CardFooter>
      {form.published && (
        <Button asChild className="w-full mt-2 text-md gap-4">
          <Link href={`/forms/${form.id}`}>View submissions <BiRightArrowAlt /></Link>
        </Button>
      )}
      {!form.published && (
        <Button variant={"secondary"} asChild className="w-full mt-2 text-md gap-4">
          <Link href={`/builder/${form.id}`}>Edit Form <FaEdit /></Link>
        </Button>
      )}
    </CardFooter>
  </Card>
}

function FormCardSkeleton() {                                                                                                                                                                                                                                                                                                               
  return <Skeleton className="border-2 border-primary/20 h-[190px] w-full" />
}

async function FormCards() {
  const forms = await GetForms();
  return <>
    {
      forms.map(form => (<FormCard key={form.id} form={form} />))
    }
  </>
}