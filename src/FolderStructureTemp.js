import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { useTheme } from "@material-ui/core/styles";
import { TreeView } from "@material-ui/lab";
import TreeItem from "@material-ui/lab/TreeItem";
import { Folders } from "./BuildFolder";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: 5,
  },
}));

export default function TreesTemp(props) {
  const theme = useTheme();
  const classes = useStyles(theme);
  const treeData = props.folderData;

  // const buildTree = (data) => {
  //   if (!data) {
  //     return null;
  //   }
  //   if (!data.children) {
  //     return <TreeItem label={data.name} />;
  //   }
  //   data.children.map((node) => {
  //     return <TreeItem label={data.name}>{buildTree(node)}</TreeItem>;
  //   });
  // };

  return (
    <div className={classes.root}>
      <List>
        <TreeView
          aria-label="file system navigator"
          defaultCollapseIcon={<IconButton />}
          defaultExpandIcon={<MenuIcon />}
          sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
        >
          <Folders children={treeData && treeData.children} />
        </TreeView>
      </List>
    </div>
  );
}