import matter from "gray-matter"
import { MDXRemote } from "next-mdx-remote"
import { serialize } from "next-mdx-remote/serialize"
import Head from "next/head"
import Link from "next/link"
import CodeBox from "../../components/CodeBox"
import { Date } from "../../components/Date"
import { ExternalLinkWithIcon } from "../../components/ExternalLink"
import { getAllPostIds, getPostData } from "../../lib/posts"

export const getStaticProps = async ({ params }) => {
  const postData = await getPostData(params?.id)
  const { data, content } = matter(postData)

  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
    },
    scope: data,
  })
  return {
    props: {
      source: mdxSource,
      frontMatter: data,
    },
  }
}

export async function getStaticPaths() {
  const paths = getAllPostIds()
  return { paths, fallback: false }
}

const components = {
  ol: props => <ol className='p-2 prose prose-xl list-decimal' {...props} />,
  li: props => <li className='pl-2 dark:text-white' {...props} />,
  a: props => (
    <ExternalLinkWithIcon className='dark:text-gray-300' {...props} />
  ),
  p: props => (
    <p className='max-w-full px-3 prose prose-xl dark:text-white' {...props} />
  ),
  strong: props => <strong className='dark:text-white' {...props} />,
  pre: props => <div className='self-stretch' {...props} />,
  code: CodeBox,
  blockquote: props => (
    <blockquote
      className='w-full px-6 py-4 border-l-4 border-blue-500 shadow-md bg-gray-50 dark:bg-gray-800'
      {...props}
    />
  ),
}

export default function Post({ source, frontMatter }) {
  return (
    <div className='flex flex-col items-start max-w-screen-lg pb-3 mx-auto space-y-5 lg:px-0 '>
      <Head>
        <title>{frontMatter.title}</title>
      </Head>
      <header className='pl-3'>
        <h1 className='font-mono text-4xl uppercase'>{frontMatter.title}</h1>
        <Date dateString={frontMatter.date} className='font-mono' />
        <div className='flex flex-wrap mt-3'>
          {frontMatter.tags.map(tag => (
            <span
              className='px-3 py-2 m-1 text-xs font-semibold tracking-widest uppercase bg-purple-500 rounded-full bg-opacity-70'
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
      </header>
      <MDXRemote {...source} components={components} />
      <Link href='/'>
        <a className='block font-semibold btn-purple'>BACK</a>
      </Link>
    </div>
  )
}
