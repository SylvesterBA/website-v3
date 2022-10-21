import './BlogArticlePage.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import contentful from '../contentful'

const BlogArticlePage = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [featuredImageAlt, setFeaturedImageAlt] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter()
  const { id: slug } = router.query

  // const { id: slug } = useParams();
  // const { navigate } = useNavigate();

  useEffect(() => {
    console.log('console.log(content)', content);
    
    contentful
      .getEntries({
        content_type: 'blogPost',
        'fields.slug[in]': slug,
      })
      .then((entries: any) => {
        if (entries.items.length !== 1) {
          console.error('could not find entry');
        }
        return entries.items[0];
      })
      .then((entry: any) => {
        const lastUpdateDate = new Date(entry.fields.postCreatedAt);
        const formatLastUpdateDate = new Intl.DateTimeFormat('en-GB', {
          dateStyle: 'full',
          timeStyle: 'short',
        }).format(lastUpdateDate);

        setTitle(entry.fields.title);
        setDate(formatLastUpdateDate);
        setAuthor(entry.fields.author);
        setCategory(entry.fields.category.fields.title);
        setFeaturedImage(entry.fields.featuredImage.fields.file.url);
        setFeaturedImageAlt(entry.fields.featuredImage.fields.title);
        setContent(entry.fields.body);
      })
      .catch((error: any) => {
        console.error(error);
        router.push('/blog');
      });
  }, [router, slug]);

  return (
    <div className='content-center  py-14  md:py-32 flex justify-left items-center background-Image-Header bg-[url("/public/images/mobileheader.png")]  md:bg-[url("/public/images/header.png")] bg-cover bg-no-repeat bg-fixed'>
      <div className="container px-4 py-16 mx-auto md:py-20">
        <article>
          <p className="text-2xl text-pngme-fuchsia font-Proxima-Nova-Bold md:text-4xl">
            {category}
          </p>
          <h1 className="mt-3 text-3xl leading-tight lg:text-5xl font-GT-Super text-pngme-dark sm:text-4xl">
            {title}
          </h1>
          <div className="capitalize">{author}</div>
          <div>Published on {date}</div>
          <div className="">
            <img src={featuredImage} alt={featuredImageAlt} />
          </div>
          <div className="prose mx-auto py-8">
            {/*  {documentToReactComponents(content)}  */}
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogArticlePage;
