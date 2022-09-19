import { Layout } from 'antd'

import Navbar from './Navbar';
import Content from './Content';

import classes from './index.module.less'

export default function App() {
  return <Layout className={classes.layout}>
    <Navbar />
    <Content />
  </Layout>
}
