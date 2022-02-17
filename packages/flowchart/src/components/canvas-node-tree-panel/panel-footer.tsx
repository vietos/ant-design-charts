import React, { useState, useContext } from 'react';
import { Modal, Checkbox, Button, Row, Layout, Menu } from 'antd';
import { usePanelContext } from '@antv/xflow';
import AppContext from '../../context';
import { getProps } from '../../util';
import { FlowchartProps } from '../../interface';
import { IProps, ICheckboxOption } from './interface';
import { CHECKBOX_OPTIONS } from './constants';
import { storage } from '../../util/stroage';

export interface IFooterProps extends IProps {
  visibleNodeTypes: string[];
  setVisibleNodeTypes: (visibleNodeTypes: string[]) => void;
}

export const NodePanelFooter: React.FC<IFooterProps> = (props) => {
  const { prefixClz, visibleNodeTypes, setVisibleNodeTypes } = props;
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [checkedValue, setCheckedValue] = useState<string[]>([...visibleNodeTypes]);
  const [selectedMenuItem, setSelectedMenuItem] = useState(['official']);

  const { propsProxy } = usePanelContext<IProps>();
  const panelProps = propsProxy.getValue();

  const { flowchartId } = useContext(AppContext);
  const { registerNode = [] } = (getProps(flowchartId, 'nodePanelProps') as FlowchartProps['nodePanelProps']) ?? {};
  const extraCheckBoxOptions: ICheckboxOption[] = registerNode.map((item) => {
    return {
      value: item.type,
      label: item.title,
      disabled: false,
    };
  });
  const checkBoxOptions: ICheckboxOption[] = [...CHECKBOX_OPTIONS, ...extraCheckBoxOptions];

  const handleModalOk = () => {
    setIsModalVisible(false);
    setVisibleNodeTypes([...checkedValue]);
    storage.setItem('visibleNodeTypes', [...checkedValue]);
  };

  const handleClickMenuItem = ({ key }) => {
    console.log(key);
  };

  return (
    <React.Fragment>
      <div
        className={`${prefixClz}-footer`}
        style={{
          zIndex: 1,
          ...props.style,
        }}
      >
        {panelProps.footer && React.isValidElement(panelProps.footer) && panelProps.footer}
        <Button onClick={() => setIsModalVisible(true)}>更多节点</Button>
      </div>
      <Modal
        title="更多节点"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        okText="确定"
        cancelText="取消"
        bodyStyle={{ padding: 0 }}
      >
        <Layout>
          <Layout.Sider theme="light" width={140}>
            <Checkbox.Group
              value={checkedValue}
              onChange={(values) => setCheckedValue(values as string[])}
              style={{ width: '100%' }}
            >
              <Menu style={{ width: '100%' }} defaultSelectedKeys={['official']} onClick={handleClickMenuItem}>
                {checkBoxOptions.map((option) => {
                  return (
                    <Menu.Item key={option.value}>
                      <Checkbox value={option.value} disabled={option.disabled}></Checkbox>
                      &nbsp;{option.label}
                    </Menu.Item>
                  );
                })}
              </Menu>
            </Checkbox.Group>
          </Layout.Sider>
          <Layout.Content style={{ backgroundColor: '#fff' }}></Layout.Content>
        </Layout>
      </Modal>
    </React.Fragment>
  );
};
