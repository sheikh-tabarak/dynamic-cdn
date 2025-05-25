// import Link from "next/link"
// import { ArrowRight, Cloud, Database, Globe, ImageIcon, Layers, RefreshCw } from "lucide-react"

// import { Button } from "@/components/ui/button"

// export default function Home() {
//   return (
//     <div className="flex min-h-screen flex-col">
//       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
//           <div className="flex gap-6 md:gap-10">
//             <Link href="/" className="flex items-center space-x-2">
//               <Cloud className="h-6 w-6 text-primary" />
//               <span className="inline-block font-bold">mycdn.site</span>
//             </Link>
//             <nav className="hidden gap-6 md:flex">
//               <Link
//                 href="#features"
//                 className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
//               >
//                 Features
//               </Link>
//               <Link
//                 href="#how-it-works"
//                 className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
//               >
//                 How It Works
//               </Link>
//               <Link
//                 href="#pricing"
//                 className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
//               >
//                 Pricing
//               </Link>
//             </nav>
//           </div>
//           <div className="flex flex-1 items-center justify-end space-x-4">
//             <nav className="flex items-center space-x-2">
//               <Button variant="ghost" size="sm">
//                 Login
//               </Button>
//               <Button size="sm">Get Started</Button>
//             </nav>
//           </div>
//         </div>
//       </header>
//       <main className="flex-1">
//         <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
//           <div className="container px-4 md:px-6">
//             <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
//               <div className="flex flex-col justify-center space-y-4">
//                 <div className="space-y-2">
//                   <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
//                     Dynamic Asset Management Made Simple
//                   </h1>
//                   <p className="max-w-[600px] text-muted-foreground md:text-xl">
//                     Create persistent virtual URLs for your digital assets. Update content without changing URLs.
//                     Perfect for websites, apps, and marketing campaigns.
//                   </p>
//                 </div>
//                 <div className="flex flex-col gap-2 min-[400px]:flex-row">
//                   <Button size="lg" className="gap-1">
//                     Start for free <ArrowRight className="h-4 w-4" />
//                   </Button>
//                   <Button size="lg" variant="outline">
//                     View Demo
//                   </Button>
//                 </div>
//               </div>
//               <div className="flex items-center justify-center">
//                 <div className="relative h-[350px] w-full overflow-hidden rounded-xl border bg-muted/50 p-4 shadow-xl sm:h-[400px] lg:h-[500px]">
//                   <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-muted p-4">
//                     <div className="h-full w-full rounded-lg border bg-background/90 shadow-lg">
//                       <div className="flex h-10 items-center border-b px-4">
//                         <div className="flex space-x-2">
//                           <div className="h-3 w-3 rounded-full bg-red-500"></div>
//                           <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
//                           <div className="h-3 w-3 rounded-full bg-green-500"></div>
//                         </div>
//                         <div className="ml-4 flex-1 text-center text-sm font-medium">mycdn.site Dashboard</div>
//                       </div>
//                       <div className="grid grid-cols-[220px_1fr] h-[calc(100%-40px)]">
//                         <div className="border-r p-4">
//                           <div className="space-y-1">
//                             <div className="rounded-md bg-primary/10 p-2 text-sm font-medium">Collections</div>
//                             <div className="rounded-md p-2 text-sm">Virtual URLs</div>
//                             <div className="rounded-md p-2 text-sm">Cloud Storage</div>
//                             <div className="rounded-md p-2 text-sm">Analytics</div>
//                             <div className="rounded-md p-2 text-sm">Settings</div>
//                           </div>
//                         </div>
//                         <div className="p-4">
//                           <div className="mb-4 flex items-center justify-between">
//                             <h3 className="text-lg font-semibold">Collections</h3>
//                             <Button size="sm" variant="outline">
//                               New Collection
//                             </Button>
//                           </div>
//                           <div className="space-y-2">
//                             <div className="rounded-md border p-3">
//                               <div className="font-medium">Website Assets</div>
//                               <div className="text-sm text-muted-foreground">12 virtual URLs</div>
//                             </div>
//                             <div className="rounded-md border p-3">
//                               <div className="font-medium">Marketing Campaign</div>
//                               <div className="text-sm text-muted-foreground">8 virtual URLs</div>
//                             </div>
//                             <div className="rounded-md border p-3">
//                               <div className="font-medium">Product Images</div>
//                               <div className="text-sm text-muted-foreground">24 virtual URLs</div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//         <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
//           <div className="container px-4 md:px-6">
//             <div className="flex flex-col items-center justify-center space-y-4 text-center">
//               <div className="space-y-2">
//                 <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
//                   Features
//                 </div>
//                 <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
//                   Everything you need to manage your digital assets
//                 </h2>
//                 <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
//                   Our platform provides a comprehensive set of tools to help you manage your digital assets efficiently.
//                 </p>
//               </div>
//             </div>
//             <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
//               <div className="flex flex-col items-start space-y-4 rounded-lg border p-6">
//                 <div className="rounded-full bg-primary/10 p-2">
//                   <Layers className="h-6 w-6 text-primary" />
//                 </div>
//                 <div className="space-y-2">
//                   <h3 className="text-xl font-bold">Collection Management</h3>
//                   <p className="text-muted-foreground">
//                     Organize your assets into collections for better management and organization.
//                   </p>
//                 </div>
//               </div>
//               <div className="flex flex-col items-start space-y-4 rounded-lg border p-6">
//                 <div className="rounded-full bg-primary/10 p-2">
//                   <Globe className="h-6 w-6 text-primary" />
//                 </div>
//                 <div className="space-y-2">
//                   <h3 className="text-xl font-bold">Virtual URLs</h3>
//                   <p className="text-muted-foreground">
//                     Create persistent virtual URLs that can point to different assets over time.
//                   </p>
//                 </div>
//               </div>
//               <div className="flex flex-col items-start space-y-4 rounded-lg border p-6">
//                 <div className="rounded-full bg-primary/10 p-2">
//                   <RefreshCw className="h-6 w-6 text-primary" />
//                 </div>
//                 <div className="space-y-2">
//                   <h3 className="text-xl font-bold">Asset Versioning</h3>
//                   <p className="text-muted-foreground">
//                     Maintain multiple versions of your assets and easily roll back to previous versions.
//                   </p>
//                 </div>
//               </div>
//               <div className="flex flex-col items-start space-y-4 rounded-lg border p-6">
//                 <div className="rounded-full bg-primary/10 p-2">
//                   <Cloud className="h-6 w-6 text-primary" />
//                 </div>
//                 <div className="space-y-2">
//                   <h3 className="text-xl font-bold">Cloud Storage Integration</h3>
//                   <p className="text-muted-foreground">
//                     Connect to your favorite cloud storage providers like AWS S3, Google Cloud, and Dropbox.
//                   </p>
//                 </div>
//               </div>
//               <div className="flex flex-col items-start space-y-4 rounded-lg border p-6">
//                 <div className="rounded-full bg-primary/10 p-2">
//                   <ImageIcon className="h-6 w-6 text-primary" />
//                 </div>
//                 <div className="space-y-2">
//                   <h3 className="text-xl font-bold">A/B Testing</h3>
//                   <p className="text-muted-foreground">
//                     Run A/B tests on different versions of your assets to optimize performance.
//                   </p>
//                 </div>
//               </div>
//               <div className="flex flex-col items-start space-y-4 rounded-lg border p-6">
//                 <div className="rounded-full bg-primary/10 p-2">
//                   <Database className="h-6 w-6 text-primary" />
//                 </div>
//                 <div className="space-y-2">
//                   <h3 className="text-xl font-bold">Analytics & Monitoring</h3>
//                   <p className="text-muted-foreground">
//                     Track usage metrics and access logs to gain insights into your asset performance.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//         <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
//           <div className="container px-4 md:px-6">
//             <div className="flex flex-col items-center justify-center space-y-4 text-center">
//               <div className="space-y-2">
//                 <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
//                   How It Works
//                 </div>
//                 <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
//                   Simple, powerful, and flexible
//                 </h2>
//                 <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
//                   Our platform is designed to be easy to use while providing powerful features for managing your digital
//                   assets.
//                 </p>
//               </div>
//             </div>
//             <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
//               <div className="flex flex-col items-center space-y-4 text-center">
//                 <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
//                   1
//                 </div>
//                 <div className="space-y-2">
//                   <h3 className="text-xl font-bold">Create Collections</h3>
//                   <p className="text-muted-foreground">
//                     Organize your assets by creating collections for different projects or purposes.
//                   </p>
//                 </div>
//               </div>
//               <div className="flex flex-col items-center space-y-4 text-center">
//                 <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
//                   2
//                 </div>
//                 <div className="space-y-2">
//                   <h3 className="text-xl font-bold">Add Virtual URLs</h3>
//                   <p className="text-muted-foreground">
//                     Create virtual URLs within your collections and upload your initial assets.
//                   </p>
//                 </div>
//               </div>
//               <div className="flex flex-col items-center space-y-4 text-center">
//                 <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
//                   3
//                 </div>
//                 <div className="space-y-2">
//                   <h3 className="text-xl font-bold">Update Anytime</h3>
//                   <p className="text-muted-foreground">
//                     Change the asset behind a virtual URL anytime without changing the URL itself.
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="mx-auto mt-12 max-w-3xl rounded-xl border bg-muted/50 p-8 shadow-lg">
//               <div className="space-y-4">
//                 <h3 className="text-xl font-bold">Example API Usage</h3>
//                 <div className="rounded-md bg-black p-4">
//                   <pre className="text-sm text-white">
//                     <code>
//                       {`// Connect Cloud Storage Account
// POST /api/cloud/connect  
// Payload: { provider: string, credentials: object }  

// // Create Collection
// POST /api/collections  
// Payload: { name: string, description?: string }  

// // Add Virtual URL to Collection
// POST /api/collections/:collectionId/virtualurls  
// Payload: { url: string, assetType: string, externalUrl?: string }  

// // Get Assets by Collection
// GET /api/collections/:collectionId/assets`}
//                     </code>
//                   </pre>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//         <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
//           <div className="container px-4 md:px-6">
//             <div className="flex flex-col items-center justify-center space-y-4 text-center">
//               <div className="space-y-2">
//                 <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
//                   Pricing
//                 </div>
//                 <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Simple, transparent pricing</h2>
//                 <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
//                   Choose the plan that's right for you and your team.
//                 </p>
//               </div>
//             </div>
//             <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
//               <div className="flex flex-col rounded-xl border bg-background p-6 shadow-sm">
//                 <div className="space-y-2">
//                   <h3 className="text-2xl font-bold">Starter</h3>
//                   <p className="text-muted-foreground">Perfect for individuals and small projects.</p>
//                 </div>
//                 <div className="mt-4 flex items-baseline text-5xl font-bold">
//                   $9<span className="text-lg font-normal text-muted-foreground">/month</span>
//                 </div>
//                 <ul className="mt-6 space-y-2 text-sm">
//                   <li className="flex items-center">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="24"
//                       height="24"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       className="mr-2 h-4 w-4 text-primary"
//                     >
//                       <polyline points="20 6 9 17 4 12"></polyline>
//                     </svg>
//                     5 Collections
//                   </li>
//                   <li className="flex items-center">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="24"
//                       height="24"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       className="mr-2 h-4 w-4 text-primary"
//                     >
//                       <polyline points="20 6 9 17 4 12"></polyline>
//                     </svg>
//                     50 Virtual URLs
//                   </li>
//                   <li className="flex items-center">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="24"
//                       height="24"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       className="mr-2 h-4 w-4 text-primary"
//                     >
//                       <polyline points="20 6 9 17 4 12"></polyline>
//                     </svg>
//                     5GB Storage
//                   </li>
//                   <li className="flex items-center">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="24"
//                       height="24"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       className="mr-2 h-4 w-4 text-primary"
//                     >
//                       <polyline points="20 6 9 17 4 12"></polyline>
//                     </svg>
//                     Basic Analytics
//                   </li>
//                 </ul>
//                 <Button className="mt-8">Get Started</Button>
//               </div>
//               <div className="flex flex-col rounded-xl border bg-background p-6 shadow-sm ring-2 ring-primary">
//                 <div className="space-y-2">
//                   <div className="inline-flex items-center rounded-full border border-primary px-2.5 py-0.5 text-xs font-semibold text-primary">
//                     Popular
//                   </div>
//                   <h3 className="text-2xl font-bold">Pro</h3>
//                   <p className="text-muted-foreground">Perfect for growing businesses and teams.</p>
//                 </div>
//                 <div className="mt-4 flex items-baseline text-5xl font-bold">
//                   $29<span className="text-lg font-normal text-muted-foreground">/month</span>
//                 </div>
//                 <ul className="mt-6 space-y-2 text-sm">
//                   <li className="flex items-center">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="24"
//                       height="24"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       className="mr-2 h-4 w-4 text-primary"
//                     >
//                       <polyline points="20 6 9 17 4 12"></polyline>
//                     </svg>
//                     20 Collections
//                   </li>
//                   <li className="flex items-center">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="24"
//                       height="24"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       className="mr-2 h-4 w-4 text-primary"
//                     >
//                       <polyline points="20 6 9 17 4 12"></polyline>
//                     </svg>
//                     200 Virtual URLs
//                   </li>
//                   <li className="flex items-center">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="24"
//                       height="24"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       className="mr-2 h-4 w-4 text-primary"
//                     >
//                       <polyline points="20 6 9 17 4 12"></polyline>
//                     </svg>
//                     25GB Storage
//                   </li>
//                   <li className="flex items-center">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="24"
//                       height="24"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       className="mr-2 h-4 w-4 text-primary"
//                     >
//                       <polyline points="20 6 9 17 4 12"></polyline>
//                     </svg>
//                     Advanced Analytics
//                   </li>
//                   <li className="flex items-center">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="24"
//                       height="24"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       className="mr-2 h-4 w-4 text-primary"
//                     >
//                       <polyline points="20 6 9 17 4 12"></polyline>
//                     </svg>
//                     A/B Testing
//                   </li>
//                 </ul>
//                 <Button className="mt-8" variant="default">
//                   Get Started
//                 </Button>
//               </div>
//               <div className="flex flex-col rounded-xl border bg-background p-6 shadow-sm">
//                 <div className="space-y-2">
//                   <h3 className="text-2xl font-bold">Enterprise</h3>
//                   <p className="text-muted-foreground">Perfect for large organizations and agencies.</p>
//                 </div>
//                 <div className="mt-4 flex items-baseline text-5xl font-bold">
//                   $99<span className="text-lg font-normal text-muted-foreground">/month</span>
//                 </div>
//                 <ul className="mt-6 space-y-2 text-sm">
//                   <li className="flex items-center">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="24"
//                       height="24"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       className="mr-2 h-4 w-4 text-primary"
//                     >
//                       <polyline points="20 6 9 17 4 12"></polyline>
//                     </svg>
//                     Unlimited Collections
//                   </li>
//                   <li className="flex items-center">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="24"
//                       height="24"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       className="mr-2 h-4 w-4 text-primary"
//                     >
//                       <polyline points="20 6 9 17 4 12"></polyline>
//                     </svg>
//                     Unlimited Virtual URLs
//                   </li>
//                   <li className="flex items-center">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="24"
//                       height="24"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       className="mr-2 h-4 w-4 text-primary"
//                     >
//                       <polyline points="20 6 9 17 4 12"></polyline>
//                     </svg>
//                     100GB Storage
//                   </li>
//                   <li className="flex items-center">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="24"
//                       height="24"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       className="mr-2 h-4 w-4 text-primary"
//                     >
//                       <polyline points="20 6 9 17 4 12"></polyline>
//                     </svg>
//                     Premium Analytics
//                   </li>
//                   <li className="flex items-center">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="24"
//                       height="24"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       className="mr-2 h-4 w-4 text-primary"
//                     >
//                       <polyline points="20 6 9 17 4 12"></polyline>
//                     </svg>
//                     Priority Support
//                   </li>
//                 </ul>
//                 <Button className="mt-8" variant="outline">
//                   Contact Sales
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </section>
//         <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
//           <div className="container px-4 md:px-6">
//             <div className="flex flex-col items-center justify-center space-y-4 text-center">
//               <div className="space-y-2">
//                 <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Ready to get started?</h2>
//                 <p className="max-w-[600px] text-primary-foreground/80 md:text-xl/relaxed">
//                   Sign up today and start managing your digital assets like never before.
//                 </p>
//               </div>
//               <div className="flex flex-col gap-2 min-[400px]:flex-row">
//                 <Button size="lg" variant="secondary" className="gap-1">
//                   Get Started <ArrowRight className="h-4 w-4" />
//                 </Button>
//                 <Button size="lg" variant="outline" className="text-primary-foreground border-primary-foreground">
//                   Contact Sales
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>
//       <footer className="w-full border-t py-6 md:py-0">
//         <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
//           <div className="flex items-center gap-2">
//             <Cloud className="h-6 w-6 text-primary" />
//             <p className="text-sm text-muted-foreground">© 2025 mycdn.site. All rights reserved.</p>
//           </div>
//           <div className="flex gap-4">
//             <Link href="#" className="text-sm text-muted-foreground hover:underline">
//               Terms
//             </Link>
//             <Link href="#" className="text-sm text-muted-foreground hover:underline">
//               Privacy
//             </Link>
//             <Link href="#" className="text-sm text-muted-foreground hover:underline">
//               Contact
//             </Link>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }


'use client'; // Mark this component as a Client Component

// app/page.tsx
import Link from "next/link";
import { ArrowRight, Cloud, Database, Globe, ImageIcon, Layers, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

// Assume these are client components you will create
import Hero3DScene from "@/components/hero-3d-scene";
import ParallaxSection from "@/components/parallax-section";
import AnimatedText from "@/components/animated-text";

// We'll also imagine a global smooth scroll provider if using Lenis
// import SmoothScrollProvider from '@/components/smooth-scroll-provider';

export default function Home() {

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault(); // Prevent the default anchor behavior
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' }); // Smooth scroll to the section
    }
  };
  return (
    // <SmoothScrollProvider> {/* Wrap with smooth scroll provider if using Lenis */}
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#0a0a0c] via-[#101015] to-[#0a0a0c] text-white overflow-x-hidden relative">
      {/* Background Gradients/Particles for Web3 Feel (could be 3D scene or CSS) */}
      <div className="absolute inset-0 z-0 opacity-20">
        {/* Placeholder for a subtle background 3D or particle effect */}
        {/* You'd render a simple 3D scene here or use complex CSS animations */}
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 via-purple-900 to-transparent animate-pulse-slow"></div>
      </div>

      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/40">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 relative z-10">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <Cloud className="h-6 w-6 text-primary" />
              <span className="inline-block font-bold text-lg">mycdn.site</span>
            </Link>
            <nav className="hidden gap-6 md:flex">
              <Link
                href="#features"
                onClick={(e) => scrollToSection(e, 'features')}
                className="flex scroll-smooth items-center text-sm font-medium text-gray-400 transition-colors hover:text-white"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                onClick={(e) => scrollToSection(e, 'how-it-works')}
                className="flex scroll-smooth items-center text-sm font-medium text-gray-400 transition-colors hover:text-white"
              >
                How It Works
              </Link>
              <Link
                href="#pricing"
                onClick={(e) => scrollToSection(e, 'pricing')}
                className="flex items-center text-sm font-medium text-gray-400 transition-colors hover:text-white"
              >
                Pricing
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-transparent">
                Login
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 shadow-lg transition-all duration-300">
                Get Started
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        {/* Hero Section - The "hyper-realistic and 3D" part */}
        <section className="relative w-full h-[80vh] md:h-[90vh] flex items-center justify-center text-center overflow-hidden">
          <div className="absolute inset-0">
            {/* This is where your main 3D scene would live */}
            <Hero3DScene /> {/* Client Component for Three.js/R3F */}
          </div>
          <div className="relative z-10 space-y-6 px-4 md:px-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-shift">
                <AnimatedText text="The Future of Decentralized Assets is Here." delay={0.5} /> {/* Client Component for text animation */}
              </h1>
              <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed font-light mt-4">
                <AnimatedText text="Unlock unprecedented control and immutability for your digital presence. A new era of persistent, programmable content awaits." delay={1} />
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" className="gap-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 shadow-xl transform hover:scale-105 transition-all duration-300">
                Explore the Protocol <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-gray-600 text-gray-200 hover:bg-gray-800 hover:text-white transition-all duration-300">
                Watch Genesis Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Feature Section with Parallax and Animated Elements */}
         <section id="features" >
        <ParallaxSection  className="w-full py-20 md:py-32 lg:py-48 bg-black/50 backdrop-blur-sm relative z-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
              <div className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-1 text-sm font-semibold text-white shadow-lg">
                Decentralized Power
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                <AnimatedText text="Innovate, Iterate, and Own Your Content." />
              </h2>
              <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-lg/relaxed xl:text-xl/relaxed">
                Our platform provides a comprehensive set of tools to help you manage your digital assets with
                unprecedented control and transparency, powered by the blockchain.
              </p>
            </div>
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 py-12 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature Cards - Consider adding hover 3D tilt effects here (e.g., using Framer Motion) */}
              <div className="flex flex-col items-start space-y-4 rounded-xl border border-gray-700 bg-gray-900/60 p-8 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-primary">
                <div className="rounded-full bg-primary/20 p-3">
                  <Layers className="h-7 w-7 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Immutable Collections</h3>
                  <p className="text-gray-400">
                    Organize your assets into tamper-proof collections on the blockchain for verifiable ownership.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-start space-y-4 rounded-xl border border-gray-700 bg-gray-900/60 p-8 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-primary">
                <div className="rounded-full bg-primary/20 p-3">
                  <Globe className="h-7 w-7 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Decentralized URLs</h3>
                  <p className="text-gray-400">
                    Create persistent, censorship-resistant URLs that point to your assets on the distributed web.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-start space-y-4 rounded-xl border border-gray-700 bg-gray-900/60 p-8 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-primary">
                <div className="rounded-full bg-primary/20 p-3">
                  <RefreshCw className="h-7 w-7 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Programmable Assets</h3>
                  <p className="text-gray-400">
                    Implement smart contracts to define access, royalties, and lifecycle of your digital content.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-start space-y-4 rounded-xl border border-gray-700 bg-gray-900/60 p-8 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-primary">
                <div className="rounded-full bg-primary/20 p-3">
                  <Cloud className="h-7 w-7 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Interoperable Storage</h3>
                  <p className="text-gray-400">
                    Seamlessly integrate with decentralized storage solutions like IPFS and Arweave.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-start space-y-4 rounded-xl border border-gray-700 bg-gray-900/60 p-8 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-primary">
                <div className="rounded-full bg-primary/20 p-3">
                  <ImageIcon className="h-7 w-7 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">NFT Integration</h3>
                  <p className="text-gray-400">
                    Mint, manage, and distribute NFTs linked directly to your immutable assets.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-start space-y-4 rounded-xl border border-gray-700 bg-gray-900/60 p-8 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-primary">
                <div className="rounded-full bg-primary/20 p-3">
                  <Database className="h-7 w-7 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">On-Chain Analytics</h3>
                  <p className="text-gray-400">
                    Gain transparent insights into asset usage, provenance, and engagement directly from the blockchain.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ParallaxSection>
</section>


        {/* How It Works Section - Animated Infographic */}
        <section id="how-it-works" className="w-full py-20 md:py-32 lg:py-48 relative z-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
              <div className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-1 text-sm font-semibold text-white shadow-lg">
                The Decentralized Workflow
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                <AnimatedText text="Simple Steps to a Complex Future." />
              </h2>
              <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-lg/relaxed xl:text-xl/relaxed">
                Our protocol is designed to be intuitive, abstracting the complexity of Web3 while empowering users.
              </p>
            </div>
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 py-12 md:grid-cols-3">
              {/* Steps - Imagine these triggering animations on scroll */}
              <div className="flex flex-col items-center space-y-6 text-center p-6 rounded-xl border border-gray-800 bg-gray-900/40 shadow-xl">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-4xl font-extrabold text-white shadow-lg">
                  1
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Define Your Assets</h3>
                  <p className="text-gray-400">
                    Upload or link your digital assets, defining their properties and initial versions on-chain.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-6 text-center p-6 rounded-xl border border-gray-800 bg-gray-900/40 shadow-xl">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-4xl font-extrabold text-white shadow-lg">
                  2
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Create On-Chain URLs</h3>
                  <p className="text-gray-400">
                    Mint unique, persistent virtual URLs that resolve your assets across the decentralized web.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-6 text-center p-6 rounded-xl border border-gray-800 bg-gray-900/40 shadow-xl">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-red-500 text-4xl font-extrabold text-white shadow-lg">
                  3
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Dynamic Resolution & Control</h3>
                  <p className="text-gray-400">
                    Update asset versions, define access rights, and track usage, all transparently on the blockchain.
                  </p>
                </div>
              </div>
            </div>
            <div className="mx-auto mt-20 max-w-4xl rounded-xl border border-gray-700 bg-gray-900/60 p-10 shadow-2xl relative">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Protocol Interaction Snippet</h3>
              {/* This code block could also have a subtle glow/animation */}
              <div className="rounded-lg bg-black p-6 font-mono text-sm overflow-auto max-h-96">
                <pre className="text-gray-200">
                  <code>
                    {`// Initialize connection to mycdn.site Protocol
const myCdn = new MyCdnProtocol({ rpcUrl: 'https://rpc.mycdn.site/mainnet' });

// Define a new immutable asset
const assetId = await myCdn.assets.define({
  name: "MyCompanyLogo",
  contentType: "image/png",
  ipfsHash: "Qm...Qm...", // IPFS CID for your content
  metadata: { creator: "myCompany", version: "1.0" }
});

// Create a decentralized URL (dURL) pointing to the asset
const dUrl = await myCdn.durls.create({
  path: "/logos/company-logo",
  assetId: assetId,
  immutable: true // Set to true for permanent link
});

console.log(\`Your decentralized URL: \${dUrl.fullUrl}\`);

// Later, update the asset content without changing the dURL
const newIpfsHash = "QmV...V...";
await myCdn.assets.update(assetId, { ipfsHash: newIpfsHash });

console.log("Asset updated. dURL still resolves to new content!");

// Query asset history on-chain
const history = await myCdn.assets.getHistory(assetId);
console.log("Asset history:", history);
`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section (Similar to original but with Web3 theme) */}
        <section id="pricing" className="w-full py-20 md:py-32 lg:py-48 bg-black/50 backdrop-blur-sm relative z-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
              <div className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-1 text-sm font-semibold text-white shadow-lg">
                Protocol Access Tiers
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                <AnimatedText text="Transparent Gateway to the Decentralized Web." />
              </h2>
              <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-lg/relaxed xl:text-xl/relaxed">
                Choose the access tier that scales with your decentralized ambitions. Powered by blockchain economics.
              </p>
            </div>
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
              {/* Pricing Cards - Potentially animate these on scroll */}
              <div className="flex flex-col rounded-xl border border-gray-700 bg-gray-900/60 p-8 shadow-2xl transition-all duration-300 hover:scale-[1.03] hover:border-blue-500">
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-white">Developer</h3>
                  <p className="text-gray-400">Ideal for initial dApp development and personal projects.</p>
                </div>
                <div className="mt-6 flex items-baseline text-6xl font-extrabold text-white">
                  0<span className="text-lg font-normal text-gray-400 ml-2">MYCDN / month</span>
                </div>
                <ul className="mt-8 space-y-3 text-lg text-gray-300">
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5 text-primary">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    10 On-Chain Collections
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5 text-primary">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    100 Decentralized URLs
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5 text-primary">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    1GB IPFS Storage
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5 text-primary">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Community Support
                  </li>
                </ul>
                <Button className="mt-10 w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-md">
                  Start Building
                </Button>
              </div>
              <div className="flex flex-col rounded-xl border border-primary bg-gray-900/80 p-8 shadow-2xl ring-2 ring-primary transition-all duration-300 hover:scale-[1.03] hover:border-purple-500">
                <div className="space-y-4">
                  <div className="inline-flex items-center rounded-full bg-primary/20 px-3 py-1 text-sm font-semibold text-primary border border-primary">
                    Recommended
                  </div>
                  <h3 className="text-3xl font-bold text-white">Innovator</h3>
                  <p className="text-gray-400">For growing dApps and production-ready deployments.</p>
                </div>
                <div className="mt-6 flex items-baseline text-6xl font-extrabold text-white">
                  50<span className="text-lg font-normal text-gray-400 ml-2">MYCDN / month</span>
                </div>
                <ul className="mt-8 space-y-3 text-lg text-gray-300">
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5 text-primary">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Unlimited Collections
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5 text-primary">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    1,000 Decentralized URLs
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5 text-primary">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    25GB IPFS Storage
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5 text-primary">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Advanced On-Chain Analytics
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5 text-primary">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Dedicated Support Channel
                  </li>
                </ul>
                <Button className="mt-10 w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 shadow-xl">
                  Go Pro
                </Button>
              </div>
              <div className="flex flex-col rounded-xl border border-gray-700 bg-gray-900/60 p-8 shadow-2xl transition-all duration-300 hover:scale-[1.03] hover:border-green-500">
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-white">Enterprise</h3>
                  <p className="text-gray-400">For large-scale decentralized applications and institutional use.</p>
                </div>
                <div className="mt-6 flex items-baseline text-6xl font-extrabold text-white">
                  Custom<span className="text-lg font-normal text-gray-400 ml-2">/month</span>
                </div>
                <ul className="mt-8 space-y-3 text-lg text-gray-300">
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5 text-primary">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Full Protocol Access
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5 text-primary">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Custom dURL Limits
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5 text-primary">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Dedicated Storage Cluster
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5 text-primary">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Blockchain Integration Consulting
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5 text-primary">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    24/7 Priority Support
                  </li>
                </ul>
                <Button className="mt-10 w-full bg-gray-700 text-white hover:bg-gray-800 shadow-md" variant="outline">
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action - Futuristic Glow */}
        <section className="w-full py-20 md:py-32 lg:py-48 bg-gradient-to-br from-purple-800 to-blue-800 text-white relative z-20 overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            {/* Subtle background animation or texture */}
            <div className="w-full h-full bg-[url('/grid-pattern.svg')] bg-repeat opacity-5"></div>
          </div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-tight text-white animate-pulse-slow">
                  Ready to Shape the Decentralized Web?
                </h2>
                <p className="max-w-[800px] text-primary-foreground/90 md:text-xl/relaxed text-lg">
                  Join the pioneers. Start building with mycdn.site and secure your place in the future of digital assets.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button size="lg" className="gap-2 bg-white text-purple-700 hover:bg-gray-100 hover:text-purple-800 shadow-xl transform hover:scale-105 transition-all duration-300">
                  Join the Protocol <ArrowRight className="h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 transition-all duration-300">
                  Schedule a Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-gray-800 py-8 md:py-10 bg-gray-950 relative z-10">
        <div className="container flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <Cloud className="h-7 w-7 text-primary animate-spin-slow" />
            <p className="text-lg font-semibold text-white">mycdn.site</p>
            <span className="text-sm text-gray-500">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="#" className="text-md text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-md text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-md text-gray-400 hover:text-white transition-colors">
              Contact Us
            </Link>
            <Link href="#" className="text-md text-gray-400 hover:text-white transition-colors">
              Whitepaper
            </Link>
          </div>
        </div>
      </footer>
    </div>
    // </SmoothScrollProvider>
  );
}