import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

function TabIcon({ label, iconName, focused }) {
  const color = focused ? COLORS.teal : COLORS.textMuted;
  return (
    <View style={tabStyles.iconContainer}>
      <Ionicons
        name={focused ? iconName : `${iconName}-outline`}
        size={24}
        color={color}
      />
      <Text style={[tabStyles.label, { color }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: tabStyles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: COLORS.teal,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarItemStyle: tabStyles.tabItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Create" iconName="color-wand" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="result"
        options={{
          title: 'Result',
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Results" iconName="sparkles" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const tabStyles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    height: 64,
    paddingTop: 6,
    paddingBottom: 6,
    elevation: 0,
  },
  tabItem: {
    paddingTop: 4,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: 0.3,
  },
});
