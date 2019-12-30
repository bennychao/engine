// Made with Amplify Shader Editor
// Available at the Unity Asset Store - http://u3d.as/y3X 
Shader "New Amplify Shader"
{
	Properties
	{
		_NormalMap("NormalMap", 2D) = "bump" {}
		_MatCap("MatCap", 2D) = "white" {}
		_Color0("Color 0", Color) = (0.990566,0,0,0)
		_Color1("Color 1", Color) = (0.5566038,0.4803415,0.1128961,0)
		_GlossColor("GlossColor", Color) = (0.5566038,0.4803415,0.1128961,0)
		_Float2("Float 2", Range( 0 , 1)) = 0.05458308
		_Gloss("Gloss", Range( 0 , 500)) = 51.69175
		_CudeMap("CudeMap", CUBE) = "white" {}
		[HideInInspector] _texcoord( "", 2D ) = "white" {}
		[HideInInspector] __dirty( "", Int ) = 1
	}

	SubShader
	{
		Tags{ "RenderType" = "Opaque"  "Queue" = "Geometry+0" }
		Cull Back
		CGINCLUDE
		#include "UnityPBSLighting.cginc"
		#include "UnityShaderVariables.cginc"
		#include "Lighting.cginc"
		#pragma target 3.0
		#ifdef UNITY_PASS_SHADOWCASTER
			#undef INTERNAL_DATA
			#undef WorldReflectionVector
			#undef WorldNormalVector
			#define INTERNAL_DATA half3 internalSurfaceTtoW0; half3 internalSurfaceTtoW1; half3 internalSurfaceTtoW2;
			#define WorldReflectionVector(data,normal) reflect (data.worldRefl, half3(dot(data.internalSurfaceTtoW0,normal), dot(data.internalSurfaceTtoW1,normal), dot(data.internalSurfaceTtoW2,normal)))
			#define WorldNormalVector(data,normal) half3(dot(data.internalSurfaceTtoW0,normal), dot(data.internalSurfaceTtoW1,normal), dot(data.internalSurfaceTtoW2,normal))
		#endif
		struct Input
		{
			float3 worldNormal;
			INTERNAL_DATA
			float2 uv_texcoord;
			float3 worldPos;
		};

		struct SurfaceOutputCustomLightingCustom
		{
			half3 Albedo;
			half3 Normal;
			half3 Emission;
			half Metallic;
			half Smoothness;
			half Occlusion;
			half Alpha;
			Input SurfInput;
			UnityGIInput GIData;
		};

		uniform sampler2D _MatCap;
		uniform sampler2D _NormalMap;
		uniform float4 _NormalMap_ST;
		uniform float4 _Color0;
		uniform float4 _Color1;
		uniform samplerCUBE _CudeMap;
		uniform float _Float2;
		uniform float4 _GlossColor;
		uniform float _Gloss;

		inline half4 LightingStandardCustomLighting( inout SurfaceOutputCustomLightingCustom s, half3 viewDir, UnityGI gi )
		{
			UnityGIInput data = s.GIData;
			Input i = s.SurfInput;
			half4 c = 0;
			float2 uv_NormalMap = i.uv_texcoord * _NormalMap_ST.xy + _NormalMap_ST.zw;
			float3 tex2DNode9 = UnpackNormal( tex2D( _NormalMap, uv_NormalMap ) );
			float3 newWorldNormal14 = (WorldNormalVector( i , tex2DNode9 ));
			float3 ase_worldPos = i.worldPos;
			float3 ase_worldViewDir = normalize( UnityWorldSpaceViewDir( ase_worldPos ) );
			float fresnelNdotV27 = dot( newWorldNormal14, ase_worldViewDir );
			float fresnelNode27 = ( 0.0 + 2.0 * pow( 1.0 - fresnelNdotV27, 5.0 ) );
			float4 lerpResult30 = lerp( ( (0.3 + (tex2D( _MatCap, ( ( mul( UNITY_MATRIX_V, float4( newWorldNormal14 , 0.0 ) ).xyz * 0.5 ) + 0.5 ).xy ).r - 0.0) * (1.0 - 0.3) / (1.0 - 0.0)) * _Color0 * 2.0 ) , _Color1 , saturate( fresnelNode27 ));
			float3 WorldNormal75 = newWorldNormal14;
			float4 lerpResult37 = lerp( lerpResult30 , texCUBE( _CudeMap, reflect( ( ase_worldPos - _WorldSpaceCameraPos ) , WorldNormal75 ) ) , _Float2);
			float3 normalizeResult63 = normalize( _WorldSpaceLightPos0.xyz );
			float dotResult67 = dot( ase_worldViewDir , reflect( ( float3( 0,0,0 ) - normalizeResult63 ) , WorldNormal75 ) );
			c.rgb = ( lerpResult37 + ( _GlossColor * pow( saturate( dotResult67 ) , _Gloss ) ) ).rgb;
			c.a = 1;
			return c;
		}

		inline void LightingStandardCustomLighting_GI( inout SurfaceOutputCustomLightingCustom s, UnityGIInput data, inout UnityGI gi )
		{
			s.GIData = data;
		}

		void surf( Input i , inout SurfaceOutputCustomLightingCustom o )
		{
			o.SurfInput = i;
			o.Normal = float3(0,0,1);
		}

		ENDCG
		CGPROGRAM
		#pragma surface surf StandardCustomLighting keepalpha fullforwardshadows 

		ENDCG
		Pass
		{
			Name "ShadowCaster"
			Tags{ "LightMode" = "ShadowCaster" }
			ZWrite On
			CGPROGRAM
			#pragma vertex vert
			#pragma fragment frag
			#pragma target 3.0
			#pragma multi_compile_shadowcaster
			#pragma multi_compile UNITY_PASS_SHADOWCASTER
			#pragma skip_variants FOG_LINEAR FOG_EXP FOG_EXP2
			#include "HLSLSupport.cginc"
			#if ( SHADER_API_D3D11 || SHADER_API_GLCORE || SHADER_API_GLES || SHADER_API_GLES3 || SHADER_API_METAL || SHADER_API_VULKAN )
				#define CAN_SKIP_VPOS
			#endif
			#include "UnityCG.cginc"
			#include "Lighting.cginc"
			#include "UnityPBSLighting.cginc"
			struct v2f
			{
				V2F_SHADOW_CASTER;
				float2 customPack1 : TEXCOORD1;
				float4 tSpace0 : TEXCOORD2;
				float4 tSpace1 : TEXCOORD3;
				float4 tSpace2 : TEXCOORD4;
				UNITY_VERTEX_INPUT_INSTANCE_ID
				UNITY_VERTEX_OUTPUT_STEREO
			};
			v2f vert( appdata_full v )
			{
				v2f o;
				UNITY_SETUP_INSTANCE_ID( v );
				UNITY_INITIALIZE_OUTPUT( v2f, o );
				UNITY_INITIALIZE_VERTEX_OUTPUT_STEREO( o );
				UNITY_TRANSFER_INSTANCE_ID( v, o );
				Input customInputData;
				float3 worldPos = mul( unity_ObjectToWorld, v.vertex ).xyz;
				half3 worldNormal = UnityObjectToWorldNormal( v.normal );
				half3 worldTangent = UnityObjectToWorldDir( v.tangent.xyz );
				half tangentSign = v.tangent.w * unity_WorldTransformParams.w;
				half3 worldBinormal = cross( worldNormal, worldTangent ) * tangentSign;
				o.tSpace0 = float4( worldTangent.x, worldBinormal.x, worldNormal.x, worldPos.x );
				o.tSpace1 = float4( worldTangent.y, worldBinormal.y, worldNormal.y, worldPos.y );
				o.tSpace2 = float4( worldTangent.z, worldBinormal.z, worldNormal.z, worldPos.z );
				o.customPack1.xy = customInputData.uv_texcoord;
				o.customPack1.xy = v.texcoord;
				TRANSFER_SHADOW_CASTER_NORMALOFFSET( o )
				return o;
			}
			half4 frag( v2f IN
			#if !defined( CAN_SKIP_VPOS )
			, UNITY_VPOS_TYPE vpos : VPOS
			#endif
			) : SV_Target
			{
				UNITY_SETUP_INSTANCE_ID( IN );
				Input surfIN;
				UNITY_INITIALIZE_OUTPUT( Input, surfIN );
				surfIN.uv_texcoord = IN.customPack1.xy;
				float3 worldPos = float3( IN.tSpace0.w, IN.tSpace1.w, IN.tSpace2.w );
				half3 worldViewDir = normalize( UnityWorldSpaceViewDir( worldPos ) );
				surfIN.worldPos = worldPos;
				surfIN.worldNormal = float3( IN.tSpace0.z, IN.tSpace1.z, IN.tSpace2.z );
				surfIN.internalSurfaceTtoW0 = IN.tSpace0.xyz;
				surfIN.internalSurfaceTtoW1 = IN.tSpace1.xyz;
				surfIN.internalSurfaceTtoW2 = IN.tSpace2.xyz;
				SurfaceOutputCustomLightingCustom o;
				UNITY_INITIALIZE_OUTPUT( SurfaceOutputCustomLightingCustom, o )
				surf( surfIN, o );
				#if defined( CAN_SKIP_VPOS )
				float2 vpos = IN.pos;
				#endif
				SHADOW_CASTER_FRAGMENT( IN )
			}
			ENDCG
		}
	}
	Fallback "Diffuse"
	CustomEditor "ASEMaterialInspector"
}
/*ASEBEGIN
Version=17200
26;311;1632;1039;620.1995;-832.0852;1.379925;True;False
Node;AmplifyShaderEditor.SamplerNode;9;-899.2007,-354.8797;Inherit;True;Property;_NormalMap;NormalMap;0;0;Create;True;0;0;False;0;-1;c311b49ba73ee9d4cafff831ddf20320;c311b49ba73ee9d4cafff831ddf20320;True;0;True;bump;Auto;True;Object;-1;Auto;Texture2D;6;0;SAMPLER2D;;False;1;FLOAT2;0,0;False;2;FLOAT;0;False;3;FLOAT2;0,0;False;4;FLOAT2;0,0;False;5;FLOAT;1;False;5;FLOAT3;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.ViewMatrixNode;23;-344.2884,-457.9019;Inherit;False;0;1;FLOAT4x4;0
Node;AmplifyShaderEditor.WorldNormalVector;14;-508.8676,-235.1611;Inherit;True;False;1;0;FLOAT3;0,0,1;False;4;FLOAT3;0;FLOAT;1;FLOAT;2;FLOAT;3
Node;AmplifyShaderEditor.RangedFloatNode;15;-12.75019,-85.47882;Inherit;False;Constant;_Float0;Float 0;1;0;Create;True;0;0;False;0;0.5;0;0;0;0;1;FLOAT;0
Node;AmplifyShaderEditor.SimpleMultiplyOpNode;24;-131.4368,-373.5532;Inherit;True;2;2;0;FLOAT4x4;1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1;False;1;FLOAT3;1,0,0;False;1;FLOAT3;0
Node;AmplifyShaderEditor.WorldSpaceLightPos;62;-258.7941,1333.686;Inherit;False;0;3;FLOAT4;0;FLOAT3;1;FLOAT;2
Node;AmplifyShaderEditor.SimpleMultiplyOpNode;13;163.31,-320.6307;Inherit;True;2;2;0;FLOAT3;1,0,0;False;1;FLOAT;0;False;1;FLOAT3;0
Node;AmplifyShaderEditor.RegisterLocalVarNode;75;-477.4677,-610.8346;Inherit;False;WorldNormal;-1;True;1;0;FLOAT3;0,0,0;False;1;FLOAT3;0
Node;AmplifyShaderEditor.NormalizeNode;63;96.5118,1366.932;Inherit;False;1;0;FLOAT3;0,0,0;False;1;FLOAT3;0
Node;AmplifyShaderEditor.SimpleAddOpNode;16;480.0945,-225.2915;Inherit;True;2;2;0;FLOAT3;0,0,0;False;1;FLOAT;0;False;1;FLOAT3;0
Node;AmplifyShaderEditor.GetLocalVarNode;76;126.9838,1566.833;Inherit;False;75;WorldNormal;1;0;OBJECT;0;False;1;FLOAT3;0
Node;AmplifyShaderEditor.SimpleSubtractOpNode;74;341.26,1384.905;Inherit;False;2;0;FLOAT3;0,0,0;False;1;FLOAT3;0,0,0;False;1;FLOAT3;0
Node;AmplifyShaderEditor.SamplerNode;17;731.3672,-310.1004;Inherit;True;Property;_MatCap;MatCap;5;0;Create;True;0;0;False;0;-1;ddc7197508bf2054ba4b7bf67c2d547c;3729da0dfd423a44e8b1ea8cffb77121;True;0;False;white;Auto;False;Object;-1;Auto;Texture2D;6;0;SAMPLER2D;;False;1;FLOAT2;0,0;False;2;FLOAT;0;False;3;FLOAT2;0,0;False;4;FLOAT2;0,0;False;5;FLOAT;1;False;5;COLOR;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.ViewDirInputsCoordNode;66;503.7135,1242.677;Inherit;False;World;False;0;4;FLOAT3;0;FLOAT;1;FLOAT;2;FLOAT;3
Node;AmplifyShaderEditor.WorldPosInputsNode;32;-259.1671,352.6646;Inherit;False;0;4;FLOAT3;0;FLOAT;1;FLOAT;2;FLOAT;3
Node;AmplifyShaderEditor.WorldSpaceCameraPos;33;-291.5669,580.3738;Inherit;False;0;4;FLOAT3;0;FLOAT;1;FLOAT;2;FLOAT;3
Node;AmplifyShaderEditor.ReflectOpNode;73;551.8,1444.248;Inherit;False;2;0;FLOAT3;0,0,0;False;1;FLOAT3;0,0,0;False;1;FLOAT3;0
Node;AmplifyShaderEditor.TFHCRemapNode;84;1097.066,-285.5019;Inherit;False;5;0;FLOAT;0;False;1;FLOAT;0;False;2;FLOAT;1;False;3;FLOAT;0.3;False;4;FLOAT;1;False;1;FLOAT;0
Node;AmplifyShaderEditor.SimpleSubtractOpNode;34;134.1666,411.1513;Inherit;False;2;0;FLOAT3;0,0,0;False;1;FLOAT3;0,0,0;False;1;FLOAT3;0
Node;AmplifyShaderEditor.ColorNode;26;879.181,-72.51968;Inherit;False;Property;_Color0;Color 0;6;0;Create;True;0;0;False;0;0.990566,0,0,0;0.490566,0.1161113,0.0254539,0;True;0;5;COLOR;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.DotProductOpNode;67;797.814,1334.113;Inherit;False;2;0;FLOAT3;0,0,0;False;1;FLOAT3;0,0,0;False;1;FLOAT;0
Node;AmplifyShaderEditor.GetLocalVarNode;78;6.820301,674.3583;Inherit;False;75;WorldNormal;1;0;OBJECT;0;False;1;FLOAT3;0
Node;AmplifyShaderEditor.FresnelNode;27;-153.9997,32.95697;Inherit;False;Standard;WorldNormal;ViewDir;False;5;0;FLOAT3;0,0,1;False;4;FLOAT3;0,0,0;False;1;FLOAT;0;False;2;FLOAT;2;False;3;FLOAT;5;False;1;FLOAT;0
Node;AmplifyShaderEditor.RangedFloatNode;21;1027.668,114.2055;Inherit;False;Constant;_Float1;Float 1;2;0;Create;True;0;0;False;0;2;0;0;0;0;1;FLOAT;0
Node;AmplifyShaderEditor.RangedFloatNode;69;919.1748,1652.812;Inherit;False;Property;_Gloss;Gloss;12;0;Create;True;0;0;False;0;51.69175;181;0;500;0;1;FLOAT;0
Node;AmplifyShaderEditor.SaturateNode;68;994.72,1334.471;Inherit;True;1;0;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.SimpleMultiplyOpNode;20;1332.418,-74.68826;Inherit;True;3;3;0;FLOAT;0;False;1;COLOR;0,0,0,0;False;2;FLOAT;0;False;1;COLOR;0
Node;AmplifyShaderEditor.TexturePropertyNode;41;483.351,648.0168;Inherit;True;Property;_CudeMap;CudeMap;14;0;Create;True;0;0;False;0;None;ef7513b54a0670140b9b967af7620563;False;white;LockedToCube;Cube;-1;0;1;SAMPLERCUBE;0
Node;AmplifyShaderEditor.ColorNode;29;965.0383,245.6021;Inherit;False;Property;_Color1;Color 1;7;0;Create;True;0;0;False;0;0.5566038,0.4803415,0.1128961,0;0.9716981,0.7205175,0.5912691,0;True;0;5;COLOR;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.ReflectOpNode;31;482.5888,436.894;Inherit;False;2;0;FLOAT3;0,0,0;False;1;FLOAT3;0,0,0;False;1;FLOAT3;0
Node;AmplifyShaderEditor.SaturateNode;28;477.1468,157.4574;Inherit;False;1;0;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.RangedFloatNode;38;1422.673,455.1414;Inherit;True;Property;_Float2;Float 2;10;0;Create;True;0;0;False;0;0.05458308;0.294;0;1;0;1;FLOAT;0
Node;AmplifyShaderEditor.ColorNode;77;1429.899,1273.747;Inherit;False;Property;_GlossColor;GlossColor;9;0;Create;True;0;0;False;0;0.5566038,0.4803415,0.1128961,0;1,0.9524127,0.7311321,0;True;0;5;COLOR;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.SamplerNode;35;879.6251,483.5113;Inherit;True;Property;_ReflectMap;ReflectMap;4;0;Create;True;0;0;False;0;-1;22da5d1de6e73784baf43826df424dc0;22da5d1de6e73784baf43826df424dc0;True;0;False;white;Auto;False;Object;-1;Auto;Cube;6;0;SAMPLER2D;;False;1;FLOAT3;0,0,0;False;2;FLOAT;0;False;3;FLOAT3;0,0,0;False;4;FLOAT3;0,0,0;False;5;FLOAT;1;False;5;COLOR;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.LerpOp;30;1608.98,113.7665;Inherit;False;3;0;COLOR;0,0,0,0;False;1;COLOR;0,0,0,0;False;2;FLOAT;0;False;1;COLOR;0
Node;AmplifyShaderEditor.PowerNode;70;1371.688,1532.361;Inherit;True;2;0;FLOAT;0;False;1;FLOAT;1;False;1;FLOAT;0
Node;AmplifyShaderEditor.LerpOp;37;1850.068,317.3188;Inherit;False;3;0;COLOR;0,0,0,0;False;1;COLOR;0,0,0,0;False;2;FLOAT;0;False;1;COLOR;0
Node;AmplifyShaderEditor.SimpleMultiplyOpNode;71;1798.298,1239.216;Inherit;True;2;2;0;COLOR;0,0,0,0;False;1;FLOAT;0;False;1;COLOR;0
Node;AmplifyShaderEditor.SaturateNode;56;678.066,1040.034;Inherit;False;1;0;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.GetLocalVarNode;81;1442.718,738.0047;Inherit;False;79;NormapMap;1;0;OBJECT;0;False;1;FLOAT3;0
Node;AmplifyShaderEditor.MMatrixNode;83;-269.8053,-489.5459;Inherit;False;0;1;FLOAT4x4;0
Node;AmplifyShaderEditor.FunctionNode;53;1848.62,706.3762;Inherit;True;Blinn-Phong Light;1;;1;cf814dba44d007a4e958d2ddd5813da6;0;3;42;COLOR;0,0,0,0;False;52;FLOAT3;0,0,0;False;43;COLOR;0,0,0,0;False;2;COLOR;0;FLOAT;57
Node;AmplifyShaderEditor.MVMatrixNode;82;-242.7036,-551.4694;Inherit;False;0;1;FLOAT4x4;0
Node;AmplifyShaderEditor.ColorNode;57;1067.642,1057.234;Inherit;False;Property;_Color2;Color 2;8;0;Create;True;0;0;False;0;0.5566038,0.4803415,0.1128961,0;0,0,0,0;True;0;5;COLOR;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.SimpleMultiplyOpNode;61;1494.847,870.1578;Inherit;False;2;2;0;FLOAT;0;False;1;COLOR;0,0,0,0;False;1;COLOR;0
Node;AmplifyShaderEditor.DotProductOpNode;55;426.5634,965.8474;Inherit;False;2;0;FLOAT3;0,0,0;False;1;FLOAT3;0,0,0;False;1;FLOAT;0
Node;AmplifyShaderEditor.GetLocalVarNode;80;-254.2956,997.4015;Inherit;False;79;NormapMap;1;0;OBJECT;0;False;1;FLOAT3;0
Node;AmplifyShaderEditor.RegisterLocalVarNode;79;-747.3585,-613.2503;Inherit;False;NormapMap;-1;True;1;0;FLOAT3;0,0,0;False;1;FLOAT3;0
Node;AmplifyShaderEditor.RangedFloatNode;58;862.0991,789.7091;Inherit;False;Property;_Float3;Float 3;11;0;Create;True;0;0;False;0;1;0;0;1;0;1;FLOAT;0
Node;AmplifyShaderEditor.LerpOp;60;1228.594,879.372;Inherit;False;3;0;FLOAT;0;False;1;FLOAT;0;False;2;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.RangedFloatNode;59;827.8008,909.493;Inherit;False;Property;_Float4;Float 4;13;0;Create;True;0;0;False;0;0.2772538;0;0;1;0;1;FLOAT;0
Node;AmplifyShaderEditor.IndirectSpecularLight;54;84.99084,1001.291;Inherit;False;Tangent;3;0;FLOAT3;0,0,1;False;1;FLOAT;0.5;False;2;FLOAT;1;False;1;FLOAT3;0
Node;AmplifyShaderEditor.SimpleAddOpNode;72;2271.367,775.3282;Inherit;True;2;2;0;COLOR;0,0,0,0;False;1;COLOR;0,0,0,0;False;1;COLOR;0
Node;AmplifyShaderEditor.StandardSurfaceOutputNode;2;2639.112,545.8759;Float;False;True;2;ASEMaterialInspector;0;0;CustomLighting;New Amplify Shader;False;False;False;False;False;False;False;False;False;False;False;False;False;False;False;False;False;False;False;False;False;Back;0;False;-1;0;False;-1;False;0;False;-1;0;False;-1;False;0;Opaque;0.5;True;True;0;False;Opaque;;Geometry;All;14;all;True;True;True;True;0;False;-1;False;0;False;-1;255;False;-1;255;False;-1;0;False;-1;0;False;-1;0;False;-1;0;False;-1;0;False;-1;0;False;-1;0;False;-1;0;False;-1;False;2;15;10;25;False;0.5;True;0;0;False;-1;0;False;-1;0;0;False;-1;0;False;-1;0;False;-1;0;False;-1;0;False;0;0,0,0,0;VertexOffset;True;False;Cylindrical;False;Relative;0;;-1;-1;-1;-1;0;False;0;0;False;-1;-1;0;False;-1;0;0;0;False;0.1;False;-1;0;False;-1;15;0;FLOAT3;0,0,0;False;1;FLOAT3;0,0,0;False;2;FLOAT3;0,0,0;False;3;FLOAT3;0,0,0;False;4;FLOAT;0;False;6;FLOAT3;0,0,0;False;7;FLOAT3;0,0,0;False;8;FLOAT;0;False;9;FLOAT;0;False;10;FLOAT;0;False;13;FLOAT3;0,0,0;False;11;FLOAT3;0,0,0;False;12;FLOAT3;0,0,0;False;14;FLOAT4;0,0,0,0;False;15;FLOAT3;0,0,0;False;0
WireConnection;14;0;9;0
WireConnection;24;0;23;0
WireConnection;24;1;14;0
WireConnection;13;0;24;0
WireConnection;13;1;15;0
WireConnection;75;0;14;0
WireConnection;63;0;62;1
WireConnection;16;0;13;0
WireConnection;16;1;15;0
WireConnection;74;1;63;0
WireConnection;17;1;16;0
WireConnection;73;0;74;0
WireConnection;73;1;76;0
WireConnection;84;0;17;1
WireConnection;34;0;32;0
WireConnection;34;1;33;0
WireConnection;67;0;66;0
WireConnection;67;1;73;0
WireConnection;27;0;14;0
WireConnection;68;0;67;0
WireConnection;20;0;84;0
WireConnection;20;1;26;0
WireConnection;20;2;21;0
WireConnection;31;0;34;0
WireConnection;31;1;78;0
WireConnection;28;0;27;0
WireConnection;35;0;41;0
WireConnection;35;1;31;0
WireConnection;30;0;20;0
WireConnection;30;1;29;0
WireConnection;30;2;28;0
WireConnection;70;0;68;0
WireConnection;70;1;69;0
WireConnection;37;0;30;0
WireConnection;37;1;35;0
WireConnection;37;2;38;0
WireConnection;71;0;77;0
WireConnection;71;1;70;0
WireConnection;56;0;55;0
WireConnection;53;42;37;0
WireConnection;53;52;81;0
WireConnection;53;43;61;0
WireConnection;61;0;60;0
WireConnection;61;1;57;0
WireConnection;55;0;78;0
WireConnection;55;1;54;0
WireConnection;79;0;9;0
WireConnection;60;0;58;0
WireConnection;60;1;59;0
WireConnection;60;2;56;0
WireConnection;54;0;80;0
WireConnection;72;0;37;0
WireConnection;72;1;71;0
WireConnection;2;13;72;0
ASEEND*/
//CHKSM=73912656EFE2444AB34AF2CE0893952005BBB0AA