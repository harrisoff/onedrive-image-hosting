import classes from './index.module.less'

type Props = {
  children: React.ReactNode
}
export default (props: Props) => {
  const { children } = props
  return <div className={classes.fileList}>
    {children}
  </div>
}
