// Made with Amplify Shader Editor
// Available at the Unity Asset Store - http://u3d.as/y3X 
Shader "CPVRT/Carpaint_v2"
{
	Properties
	{
		_BaseColor1("Base Color 1", Color) = (1,0.9310344,0,0)
		_BaseColor2("Base Color 2", Color) = (1,0.9310344,0,0)
		_BaseMetallic("Base Metallic", Range( 0 , 1)) = 0
		_BaseSmoothness("Base Smoothness", Range( 0 , 1)) = 0
		_FlakesRGBcolorvariationAmask("Flakes (RGB = color variation, A = mask)", 2D) = "white" {}
		_FlakePower("FlakePower", Range( 0 , 1)) = 0
		_FlakesColor1("Flakes Color 1", Color) = (1,0.9310344,0,0)
		_FlakesColor2("Flakes Color 2", Color) = (1,0.9310344,0,0)
		_FlakesMetallic("Flakes Metallic", Range( 0 , 1)) = 0
		_FlakesSmoothness("Flakes Smoothness", Range( 0 , 1)) = 0
		_FlakesNormal("Flakes Normal", 2D) = "bump" {}
		_FlakesBump("Flakes Bump", Range( 0 , 1)) = 0
		_CoatNormal("Coat Normal", 2D) = "bump" {}
		_CoatBump("Coat Bump", Range( 0 , 1)) = 0
		_CoatAmount("Coat Amount", Range( 0 , 1)) = 1
		_CoatSmoothness("Coat Smoothness", Range( 0 , 1)) = 1
		_Ao("Ao", 2D) = "white" {}
		_Specular_2("Specular_2", Range( 0 , 1)) = 0
		_Specular_1("Specular_1", Range( 0 , 1)) = 0
		_SpecularColor("SpecularColor", Color) = (1,1,1,0)
		[HideInInspector] _texcoord( "", 2D ) = "white" {}
		[HideInInspector] __dirty( "", Int ) = 1
	}

	SubShader
	{
		Tags{ "RenderType" = "Opaque"  "Queue" = "Geometry+0" }
		Cull Back
		CGINCLUDE
		#include "UnityPBSLighting.cginc"
		#include "UnityStandardUtils.cginc"
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

		uniform half4 _FlakesColor1;
		uniform half4 _FlakesColor2;
		uniform sampler2D _FlakesRGBcolorvariationAmask;
		uniform float4 _FlakesRGBcolorvariationAmask_ST;
		uniform half _FlakePower;
		uniform half4 _BaseColor1;
		uniform half4 _BaseColor2;
		uniform half _CoatBump;
		uniform sampler2D _CoatNormal;
		uniform float4 _CoatNormal_ST;
		uniform half _FlakesBump;
		uniform sampler2D _FlakesNormal;
		uniform float4 _FlakesNormal_ST;
		uniform half _BaseMetallic;
		uniform half _FlakesMetallic;
		uniform half _BaseSmoothness;
		uniform half _FlakesSmoothness;
		uniform sampler2D _Ao;
		uniform float4 _Ao_ST;
		uniform half _Specular_1;
		uniform half _Specular_2;
		uniform half4 _SpecularColor;
		uniform half _CoatSmoothness;
		uniform half _CoatAmount;

		inline half4 LightingStandardCustomLighting( inout SurfaceOutputCustomLightingCustom s, half3 viewDir, UnityGI gi )
		{
			UnityGIInput data = s.GIData;
			Input i = s.SurfInput;
			half4 c = 0;
			SurfaceOutputStandard s1 = (SurfaceOutputStandard ) 0;
			float2 uv_FlakesRGBcolorvariationAmask = i.uv_texcoord * _FlakesRGBcolorvariationAmask_ST.xy + _FlakesRGBcolorvariationAmask_ST.zw;
			float FlakeMask284 = tex2D( _FlakesRGBcolorvariationAmask, uv_FlakesRGBcolorvariationAmask ).a;
			float4 lerpResult277 = lerp( _FlakesColor1 , _FlakesColor2 , ( FlakeMask284 * _FlakePower ));
			float3 ase_worldPos = i.worldPos;
			float3 ase_worldViewDir = normalize( UnityWorldSpaceViewDir( ase_worldPos ) );
			float2 uv_CoatNormal = i.uv_texcoord * _CoatNormal_ST.xy + _CoatNormal_ST.zw;
			float3 tex2DNode171 = UnpackScaleNormal( tex2D( _CoatNormal, uv_CoatNormal ), _CoatBump );
			float3 NormalMap349 = tex2DNode171;
			float fresnelNdotV201 = dot( normalize( (WorldNormalVector( i , NormalMap349 )) ), ase_worldViewDir );
			float fresnelNode201 = ( 0.1 + 1.0 * pow( 1.0 - fresnelNdotV201, 1.0 ) );
			float temp_output_356_0 = saturate( fresnelNode201 );
			float4 lerpResult278 = lerp( _BaseColor1 , _BaseColor2 , temp_output_356_0);
			float4 lerpResult217 = lerp( lerpResult277 , lerpResult278 , temp_output_356_0);
			s1.Albedo = lerpResult217.rgb;
			float Distance343 = distance( ase_worldPos , _WorldSpaceCameraPos );
			float3 indirectNormal427 = WorldNormalVector( i , NormalMap349 );
			Unity_GlossyEnvironmentData g427 = UnityGlossyEnvironmentSetup( 0.5, data.worldViewDir, indirectNormal427, float3(0,0,0));
			float3 indirectSpecular427 = UnityGI_IndirectSpecular( data, 1.0, indirectNormal427, g427 );
			float dotResult410 = dot( normalize( (WorldNormalVector( i , NormalMap349 )) ) , indirectSpecular427 );
			half ShadowArea412 = saturate( dotResult410 );
			float2 uv_FlakesNormal = i.uv_texcoord * _FlakesNormal_ST.xy + _FlakesNormal_ST.zw;
			s1.Normal = WorldNormalVector( i , BlendNormals( UnpackScaleNormal( tex2D( _FlakesNormal, uv_FlakesNormal ), ( _FlakesBump * ( ( 1.0 - (0.0 + (Distance343 - 0.0) * (1.0 - 0.0) / (2.0 - 0.0)) ) * ShadowArea412 ) ) ) , NormalMap349 ) );
			s1.Emission = float3( 0,0,0 );
			float temp_output_346_0 = ( FlakeMask284 * ( 1.0 - (0.0 + (Distance343 - 0.0) * (1.0 - 0.0) / (10.0 - 0.0)) ) );
			float lerpResult218 = lerp( _BaseMetallic , _FlakesMetallic , temp_output_346_0);
			s1.Metallic = lerpResult218;
			float lerpResult232 = lerp( _BaseSmoothness , _FlakesSmoothness , temp_output_346_0);
			s1.Smoothness = lerpResult232;
			float2 uv_Ao = i.uv_texcoord * _Ao_ST.xy + _Ao_ST.zw;
			float4 tex2DNode325 = tex2D( _Ao, uv_Ao );
			s1.Occlusion = tex2DNode325.r;

			data.light = gi.light;

			UnityGI gi1 = gi;
			#ifdef UNITY_PASS_FORWARDBASE
			Unity_GlossyEnvironmentData g1 = UnityGlossyEnvironmentSetup( s1.Smoothness, data.worldViewDir, s1.Normal, float3(0,0,0));
			gi1 = UnityGlobalIllumination( data, s1.Occlusion, s1.Normal, g1 );
			#endif

			float3 surfResult1 = LightingStandard ( s1, viewDir, gi1 ).rgb;
			surfResult1 += s1.Emission;

			#ifdef UNITY_PASS_FORWARDADD//1
			surfResult1 -= s1.Emission;
			#endif//1
			SurfaceOutputStandardSpecular s166 = (SurfaceOutputStandardSpecular ) 0;
			float4 Color366 = lerpResult278;
			s166.Albedo = Color366.rgb;
			s166.Normal = WorldNormalVector( i , tex2DNode171 );
			s166.Emission = float3( 0,0,0 );
			float lerpResult432 = lerp( _Specular_1 , _Specular_2 , ShadowArea412);
			s166.Specular = ( lerpResult432 * _SpecularColor ).rgb;
			s166.Smoothness = _CoatSmoothness;
			s166.Occlusion = tex2DNode325.r;

			data.light = gi.light;

			UnityGI gi166 = gi;
			#ifdef UNITY_PASS_FORWARDBASE
			Unity_GlossyEnvironmentData g166 = UnityGlossyEnvironmentSetup( s166.Smoothness, data.worldViewDir, s166.Normal, float3(0,0,0));
			gi166 = UnityGlobalIllumination( data, s166.Occlusion, s166.Normal, g166 );
			#endif

			float3 surfResult166 = LightingStandardSpecular ( s166, viewDir, gi166 ).rgb;
			surfResult166 += s166.Emission;

			#ifdef UNITY_PASS_FORWARDADD//166
			surfResult166 -= s166.Emission;
			#endif//166
			float fresnelNdotV279 = dot( normalize( (WorldNormalVector( i , NormalMap349 )) ), ase_worldViewDir );
			float fresnelNode279 = ( 0.25 + 1.0 * pow( 1.0 - fresnelNdotV279, 5.0 ) );
			float3 lerpResult208 = lerp( surfResult1 , surfResult166 , (0.5 + (saturate( ( ( (0.0 + (Distance343 - 0.0) * (0.2 - 0.0) / (10.0 - 0.0)) + ( saturate( fresnelNode279 ) * _CoatAmount ) ) * tex2DNode325.r ) ) - 0.0) * (1.0 - 0.5) / (1.0 - 0.0)));
			c.rgb = lerpResult208;
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
23;770;1632;1039;921.3153;380.7462;1.9;True;False
Node;AmplifyShaderEditor.RangedFloatNode;180;890.8012,936.573;Half;False;Property;_CoatBump;Coat Bump;13;0;Create;True;0;0;False;0;0;1;0;1;0;1;FLOAT;0
Node;AmplifyShaderEditor.SamplerNode;171;1223.205,892.8442;Inherit;True;Property;_CoatNormal;Coat Normal;12;0;Create;True;0;0;False;0;-1;None;c311b49ba73ee9d4cafff831ddf20320;True;0;True;bump;Auto;True;Object;-1;Auto;Texture2D;6;0;SAMPLER2D;;False;1;FLOAT2;0,0;False;2;FLOAT;1;False;3;FLOAT2;0,0;False;4;FLOAT2;0,0;False;5;FLOAT;0.5;False;5;FLOAT3;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.RegisterLocalVarNode;349;1673.641,893.27;Float;False;NormalMap;-1;True;1;0;FLOAT3;0,0,0;False;1;FLOAT3;0
Node;AmplifyShaderEditor.WorldSpaceCameraPos;382;-1762.018,383.4418;Inherit;False;0;4;FLOAT3;0;FLOAT;1;FLOAT;2;FLOAT;3
Node;AmplifyShaderEditor.WorldPosInputsNode;380;-1767.396,237.2275;Float;False;0;4;FLOAT3;0;FLOAT;1;FLOAT;2;FLOAT;3
Node;AmplifyShaderEditor.GetLocalVarNode;351;-2272.953,182.8943;Inherit;True;349;NormalMap;1;0;OBJECT;0;False;1;FLOAT3;0
Node;AmplifyShaderEditor.DistanceOpNode;379;-1357.22,243.3999;Inherit;True;2;0;FLOAT3;0,0,0;False;1;FLOAT3;0,0,0;False;1;FLOAT;0
Node;AmplifyShaderEditor.WorldNormalVector;408;-1712.933,556.405;Inherit;False;True;1;0;FLOAT3;0,0,0;False;4;FLOAT3;0;FLOAT;1;FLOAT;2;FLOAT;3
Node;AmplifyShaderEditor.IndirectSpecularLight;427;-1717.233,729.1413;Inherit;True;Tangent;3;0;FLOAT3;0,0,0;False;1;FLOAT;0.5;False;2;FLOAT;1;False;1;FLOAT3;0
Node;AmplifyShaderEditor.RegisterLocalVarNode;343;-1108.867,238.3999;Float;False;Distance;-1;True;1;0;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.GetLocalVarNode;350;-1300.59,1149.302;Inherit;True;349;NormalMap;1;0;OBJECT;0;False;1;FLOAT3;0
Node;AmplifyShaderEditor.SamplerNode;228;-337.1499,-60.77929;Inherit;True;Property;_FlakesRGBcolorvariationAmask;Flakes (RGB = color variation, A = mask);4;0;Create;True;0;0;False;0;-1;None;2741be98b31d56c43ad9cfbcaf99a799;True;0;False;white;Auto;False;Object;-1;Auto;Texture2D;6;0;SAMPLER2D;;False;1;FLOAT2;0,0;False;2;FLOAT;1;False;3;FLOAT2;0,0;False;4;FLOAT2;0,0;False;5;FLOAT;1;False;5;COLOR;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.WorldNormalVector;397;-1941.259,-104.6551;Inherit;True;True;1;0;FLOAT3;0,0,0;False;4;FLOAT3;0;FLOAT;1;FLOAT;2;FLOAT;3
Node;AmplifyShaderEditor.DotProductOpNode;410;-1211.532,529.9332;Inherit;True;2;0;FLOAT3;0,0,0;False;1;FLOAT3;0,0,0;False;1;FLOAT;0
Node;AmplifyShaderEditor.RegisterLocalVarNode;284;64.09366,-30.1658;Float;True;FlakeMask;-1;True;1;0;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.GetLocalVarNode;345;-234.4741,747.9387;Inherit;False;343;Distance;1;0;OBJECT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.SaturateNode;438;-929.1938,577.8806;Inherit;False;1;0;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.FresnelNode;201;-1490.533,-81.13189;Inherit;True;Standard;WorldNormal;ViewDir;False;5;0;FLOAT3;0,0,0;False;4;FLOAT3;0,0,0;False;1;FLOAT;0.1;False;2;FLOAT;1;False;3;FLOAT;1;False;1;FLOAT;0
Node;AmplifyShaderEditor.WorldNormalVector;399;-1008.727,1151.335;Inherit;True;True;1;0;FLOAT3;0,0,0;False;4;FLOAT3;0;FLOAT;1;FLOAT;2;FLOAT;3
Node;AmplifyShaderEditor.GetLocalVarNode;285;98.91335,611.9733;Inherit;False;284;FlakeMask;1;0;OBJECT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.FresnelNode;279;-702.624,1154.001;Inherit;True;Standard;WorldNormal;ViewDir;False;5;0;FLOAT3;0,0,0;False;4;FLOAT3;0,0,0;False;1;FLOAT;0.25;False;2;FLOAT;1;False;3;FLOAT;5;False;1;FLOAT;0
Node;AmplifyShaderEditor.SaturateNode;356;-935.8428,-149.8863;Inherit;True;1;0;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.TFHCRemapNode;418;30.31995,750.0408;Inherit;True;5;0;FLOAT;0;False;1;FLOAT;0;False;2;FLOAT;10;False;3;FLOAT;0;False;4;FLOAT;1;False;1;FLOAT;0
Node;AmplifyShaderEditor.TFHCRemapNode;374;-878.3629,244.069;Inherit;True;5;0;FLOAT;0;False;1;FLOAT;0;False;2;FLOAT;2;False;3;FLOAT;0;False;4;FLOAT;1;False;1;FLOAT;0
Node;AmplifyShaderEditor.RegisterLocalVarNode;412;-644.1172,587.373;Half;False;ShadowArea;-1;True;1;0;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.GetLocalVarNode;388;-528.8757,832.4504;Inherit;True;343;Distance;1;0;OBJECT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.WireNode;357;-432.6802,-538.2014;Inherit;False;1;0;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.SaturateNode;298;-287.1818,1169.172;Inherit;True;1;0;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.WireNode;405;426.2811,676.332;Inherit;False;1;0;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.GetLocalVarNode;417;-590.047,481.332;Inherit;False;412;ShadowArea;1;0;OBJECT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.OneMinusNode;395;-571.9622,243.5877;Inherit;False;1;0;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.RangedFloatNode;47;-501.3517,1515.234;Half;False;Property;_CoatAmount;Coat Amount;14;0;Create;True;0;0;False;0;1;1;0;1;0;1;FLOAT;0
Node;AmplifyShaderEditor.OneMinusNode;402;341.0969,747.3502;Inherit;False;1;0;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.ColorNode;271;404.1008,51.39016;Half;False;Property;_BaseColor2;Base Color 2;1;0;Create;True;0;0;False;0;1,0.9310344,0,0;0.3018868,0.3018868,0.3018868,0;False;0;5;COLOR;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.TFHCRemapNode;394;-253.4611,903.6797;Inherit;True;5;0;FLOAT;0;False;1;FLOAT;0;False;2;FLOAT;10;False;3;FLOAT;0;False;4;FLOAT;0.2;False;1;FLOAT;0
Node;AmplifyShaderEditor.GetLocalVarNode;287;-244.8121,-296.9554;Inherit;False;284;FlakeMask;1;0;OBJECT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.SimpleMultiplyOpNode;237;-26.5292,1212.858;Inherit;True;2;2;0;FLOAT;0;False;1;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.WireNode;358;227.4239,-599.5997;Inherit;False;1;0;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.SimpleMultiplyOpNode;346;569.959,746.5308;Inherit;True;2;2;0;FLOAT;0;False;1;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.RangedFloatNode;330;-267.4973,-180.9166;Half;False;Property;_FlakePower;FlakePower;5;0;Create;True;0;0;False;0;0;0.6;0;1;0;1;FLOAT;0
Node;AmplifyShaderEditor.SimpleMultiplyOpNode;416;-393.1907,301.836;Inherit;False;2;2;0;FLOAT;0;False;1;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.RangedFloatNode;11;-667.9336,98.72659;Half;False;Property;_FlakesBump;Flakes Bump;11;0;Create;True;0;0;False;0;0;0.1;0;1;0;1;FLOAT;0
Node;AmplifyShaderEditor.ColorNode;4;393.208,-150.216;Half;False;Property;_BaseColor1;Base Color 1;0;0;Create;True;0;0;False;0;1,0.9310344,0,0;1,0.2244964,0,0;False;0;5;COLOR;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.WireNode;443;902.9888,820.3375;Inherit;False;1;0;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.SimpleAddOpNode;391;246.4873,1017.73;Inherit;True;2;2;0;FLOAT;0;False;1;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.LerpOp;278;856.0209,-69.38783;Inherit;True;3;0;COLOR;0,0,0,0;False;1;COLOR;0,0,0,0;False;2;FLOAT;0;False;1;COLOR;0
Node;AmplifyShaderEditor.RangedFloatNode;431;1210.932,1216.387;Half;False;Property;_Specular_2;Specular_2;17;0;Create;True;0;0;False;0;0;0.4;0;1;0;1;FLOAT;0
Node;AmplifyShaderEditor.GetLocalVarNode;433;1247.557,1316.124;Inherit;True;412;ShadowArea;1;0;OBJECT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.ColorNode;263;-61.64148,-463.3205;Half;False;Property;_FlakesColor2;Flakes Color 2;7;0;Create;True;0;0;False;0;1,0.9310344,0,0;1,0,0,0;False;0;5;COLOR;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.GetLocalVarNode;352;-137.4491,521.6208;Inherit;True;349;NormalMap;1;0;OBJECT;0;False;1;FLOAT3;0
Node;AmplifyShaderEditor.WireNode;419;822.7041,613.4102;Inherit;False;1;0;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.RangedFloatNode;387;1215.553,1122.616;Half;False;Property;_Specular_1;Specular_1;18;0;Create;True;0;0;False;0;0;1;0;1;0;1;FLOAT;0
Node;AmplifyShaderEditor.SimpleMultiplyOpNode;331;44.22394,-252.9725;Inherit;True;2;2;0;FLOAT;0;False;1;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.SimpleMultiplyOpNode;332;-213.6963,194.4401;Inherit;True;2;2;0;FLOAT;0;False;1;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.ColorNode;216;-63.59581,-659.9294;Half;False;Property;_FlakesColor1;Flakes Color 1;6;0;Create;True;0;0;False;0;1,0.9310344,0,0;1,0.5283965,0.3161764,0;False;0;5;COLOR;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.SamplerNode;325;163.7105,1517.819;Inherit;True;Property;_Ao;Ao;16;0;Create;True;0;0;False;0;-1;None;a845d7d258e643b44a3048fcface3ca0;True;0;False;white;Auto;False;Object;-1;Auto;Texture2D;6;0;SAMPLER2D;;False;1;FLOAT2;0,0;False;2;FLOAT;0;False;3;FLOAT2;0,0;False;4;FLOAT2;0,0;False;5;FLOAT;1;False;5;COLOR;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.WireNode;441;806.5779,915.085;Inherit;False;1;0;COLOR;0,0,0,0;False;1;COLOR;0
Node;AmplifyShaderEditor.WireNode;420;1026.704,581.4102;Inherit;False;1;0;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.WireNode;406;240.8583,501.8239;Inherit;False;1;0;FLOAT3;0,0,0;False;1;FLOAT3;0
Node;AmplifyShaderEditor.LerpOp;432;1569.695,1127.257;Inherit;True;3;0;FLOAT;0;False;1;FLOAT;0;False;2;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.RangedFloatNode;233;913.1639,628.6738;Half;False;Property;_BaseSmoothness;Base Smoothness;3;0;Create;True;0;0;False;0;0;1;0;1;0;1;FLOAT;0
Node;AmplifyShaderEditor.LerpOp;277;315.4594,-378.0005;Inherit;True;3;0;COLOR;0,0,0,0;False;1;COLOR;0,0,0,0;False;2;FLOAT;0;False;1;COLOR;0
Node;AmplifyShaderEditor.SimpleMultiplyOpNode;308;555.0369,1620.685;Inherit;True;2;2;0;FLOAT;0;False;1;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.RangedFloatNode;5;739.7603,495.06;Half;False;Property;_FlakesMetallic;Flakes Metallic;8;0;Create;True;0;0;False;0;0;0.1;0;1;0;1;FLOAT;0
Node;AmplifyShaderEditor.ColorNode;430;1480.681,1362.143;Half;False;Property;_SpecularColor;SpecularColor;19;0;Create;True;0;0;False;0;1,1,1,0;0.6838235,0.2378124,0.135759,0;False;0;5;COLOR;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.RangedFloatNode;204;910.969,701.7751;Half;False;Property;_FlakesSmoothness;Flakes Smoothness;9;0;Create;True;0;0;False;0;0;1;0;1;0;1;FLOAT;0
Node;AmplifyShaderEditor.RegisterLocalVarNode;366;1170.627,-332.5296;Float;False;Color;-1;True;1;0;COLOR;0,0,0,0;False;1;COLOR;0
Node;AmplifyShaderEditor.RangedFloatNode;219;736.3806,386.3882;Half;False;Property;_BaseMetallic;Base Metallic;2;0;Create;True;0;0;False;0;0;0.2;0;1;0;1;FLOAT;0
Node;AmplifyShaderEditor.SamplerNode;7;92.2482,218.0237;Inherit;True;Property;_FlakesNormal;Flakes Normal;10;0;Create;True;0;0;False;0;-1;None;a268ab862991c4743a9281c69bb2c36a;True;0;True;bump;Auto;True;Object;-1;Auto;Texture2D;6;0;SAMPLER2D;;False;1;FLOAT2;0,0;False;2;FLOAT;1;False;3;FLOAT2;0,0;False;4;FLOAT2;0,0;False;5;FLOAT;1;False;5;FLOAT3;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.WireNode;444;1178.8,788.916;Inherit;False;1;0;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.LerpOp;218;1238.952,373.7866;Inherit;True;3;0;FLOAT;0;False;1;FLOAT;0;False;2;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.WireNode;442;1502.88,826.6295;Inherit;False;1;0;COLOR;0,0,0,0;False;1;COLOR;0
Node;AmplifyShaderEditor.RangedFloatNode;172;1742.685,1421.954;Half;False;Property;_CoatSmoothness;Coat Smoothness;15;0;Create;True;0;0;False;0;1;1;0;1;0;1;FLOAT;0
Node;AmplifyShaderEditor.LerpOp;217;1530.892,-176.4525;Inherit;True;3;0;COLOR;0,0,0,0;False;1;COLOR;0,0,0,0;False;2;FLOAT;0;False;1;COLOR;0
Node;AmplifyShaderEditor.SaturateNode;368;1138.288,1847.558;Inherit;True;1;0;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.WireNode;440;1956.291,1564.879;Inherit;False;1;0;COLOR;0,0,0,0;False;1;COLOR;0
Node;AmplifyShaderEditor.GetLocalVarNode;365;1948.59,1017.452;Inherit;False;366;Color;1;0;OBJECT;0;False;1;COLOR;0
Node;AmplifyShaderEditor.BlendNormalsNode;326;494.9922,306.3769;Inherit;False;0;3;0;FLOAT3;0,0,0;False;1;FLOAT3;0,0,0;False;2;FLOAT3;0,0,0;False;1;FLOAT3;0
Node;AmplifyShaderEditor.SimpleMultiplyOpNode;429;1902.007,1163.746;Inherit;False;2;2;0;FLOAT;0;False;1;COLOR;0,0,0,0;False;1;COLOR;0
Node;AmplifyShaderEditor.LerpOp;232;1263.749,627.6481;Inherit;True;3;0;FLOAT;0;False;1;FLOAT;0;False;2;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.CustomStandardSurface;166;2137.722,1094.361;Inherit;False;Specular;Tangent;6;0;FLOAT3;0,0,0;False;1;FLOAT3;0,0,1;False;2;FLOAT3;0,0,0;False;3;FLOAT3;0,0,0;False;4;FLOAT;0;False;5;FLOAT;1;False;1;FLOAT3;0
Node;AmplifyShaderEditor.CustomStandardSurface;1;2147.882,437.8798;Inherit;False;Metallic;Tangent;6;0;FLOAT3;0,0,0;False;1;FLOAT3;0,0,1;False;2;FLOAT3;0,0,0;False;3;FLOAT;0;False;4;FLOAT;0;False;5;FLOAT;1;False;1;FLOAT3;0
Node;AmplifyShaderEditor.TFHCRemapNode;439;1729.079,1845.876;Inherit;True;5;0;FLOAT;0;False;1;FLOAT;0;False;2;FLOAT;1;False;3;FLOAT;0.5;False;4;FLOAT;1;False;1;FLOAT;0
Node;AmplifyShaderEditor.LerpOp;208;2812.934,744.2529;Inherit;True;3;0;FLOAT3;0,0,0;False;1;FLOAT3;0,0,0;False;2;FLOAT;0;False;1;FLOAT3;0
Node;AmplifyShaderEditor.WorldSpaceViewDirHlpNode;422;-1693.327,1113.178;Inherit;True;1;0;FLOAT4;0,0,0,1;False;4;FLOAT3;0;FLOAT;1;FLOAT;2;FLOAT;3
Node;AmplifyShaderEditor.StandardSurfaceOutputNode;0;3209.695,614.5984;Float;False;True;2;ASEMaterialInspector;0;0;CustomLighting;CPVRT/Carpaint_v2;False;False;False;False;False;False;False;False;False;False;False;False;False;False;False;False;False;False;False;False;False;Back;0;False;-1;0;False;-1;False;0;False;-1;0;False;-1;False;0;Opaque;0.5;True;True;0;False;Opaque;;Geometry;All;14;all;True;True;True;True;0;False;-1;False;0;False;-1;255;False;-1;255;False;-1;0;False;-1;0;False;-1;0;False;-1;0;False;-1;0;False;-1;0;False;-1;0;False;-1;0;False;-1;False;0;4;10;25;False;0.5;True;0;0;False;-1;0;False;-1;0;0;False;-1;0;False;-1;1;False;-1;1;False;-1;0;False;0;0,0,0,0;VertexOffset;True;False;Cylindrical;False;Relative;0;;-1;-1;-1;-1;0;False;0;0;False;-1;-1;0;False;-1;0;0;0;False;0.1;False;-1;0;False;-1;15;0;FLOAT3;0,0,0;False;1;FLOAT3;0,0,0;False;2;FLOAT3;0,0,0;False;3;FLOAT3;0,0,0;False;4;FLOAT;0;False;6;FLOAT3;0,0,0;False;7;FLOAT3;0,0,0;False;8;FLOAT;0;False;9;FLOAT;0;False;10;FLOAT;0;False;13;FLOAT3;0,0,0;False;11;FLOAT3;0,0,0;False;12;FLOAT3;0,0,0;False;14;FLOAT4;0,0,0,0;False;15;FLOAT3;0,0,0;False;0
WireConnection;171;5;180;0
WireConnection;349;0;171;0
WireConnection;379;0;380;0
WireConnection;379;1;382;0
WireConnection;408;0;351;0
WireConnection;427;0;351;0
WireConnection;343;0;379;0
WireConnection;397;0;351;0
WireConnection;410;0;408;0
WireConnection;410;1;427;0
WireConnection;284;0;228;4
WireConnection;438;0;410;0
WireConnection;201;0;397;0
WireConnection;399;0;350;0
WireConnection;279;0;399;0
WireConnection;356;0;201;0
WireConnection;418;0;345;0
WireConnection;374;0;343;0
WireConnection;412;0;438;0
WireConnection;357;0;356;0
WireConnection;298;0;279;0
WireConnection;405;0;285;0
WireConnection;395;0;374;0
WireConnection;402;0;418;0
WireConnection;394;0;388;0
WireConnection;237;0;298;0
WireConnection;237;1;47;0
WireConnection;358;0;357;0
WireConnection;346;0;405;0
WireConnection;346;1;402;0
WireConnection;416;0;395;0
WireConnection;416;1;417;0
WireConnection;443;0;346;0
WireConnection;391;0;394;0
WireConnection;391;1;237;0
WireConnection;278;0;4;0
WireConnection;278;1;271;0
WireConnection;278;2;358;0
WireConnection;419;0;346;0
WireConnection;331;0;287;0
WireConnection;331;1;330;0
WireConnection;332;0;11;0
WireConnection;332;1;416;0
WireConnection;441;0;325;0
WireConnection;420;0;419;0
WireConnection;406;0;352;0
WireConnection;432;0;387;0
WireConnection;432;1;431;0
WireConnection;432;2;433;0
WireConnection;277;0;216;0
WireConnection;277;1;263;0
WireConnection;277;2;331;0
WireConnection;308;0;391;0
WireConnection;308;1;325;1
WireConnection;366;0;278;0
WireConnection;7;5;332;0
WireConnection;444;0;443;0
WireConnection;218;0;219;0
WireConnection;218;1;5;0
WireConnection;218;2;420;0
WireConnection;442;0;441;0
WireConnection;217;0;277;0
WireConnection;217;1;278;0
WireConnection;217;2;356;0
WireConnection;368;0;308;0
WireConnection;440;0;325;0
WireConnection;326;0;7;0
WireConnection;326;1;406;0
WireConnection;429;0;432;0
WireConnection;429;1;430;0
WireConnection;232;0;233;0
WireConnection;232;1;204;0
WireConnection;232;2;444;0
WireConnection;166;0;365;0
WireConnection;166;1;171;0
WireConnection;166;3;429;0
WireConnection;166;4;172;0
WireConnection;166;5;440;0
WireConnection;1;0;217;0
WireConnection;1;1;326;0
WireConnection;1;3;218;0
WireConnection;1;4;232;0
WireConnection;1;5;442;0
WireConnection;439;0;368;0
WireConnection;208;0;1;0
WireConnection;208;1;166;0
WireConnection;208;2;439;0
WireConnection;0;13;208;0
ASEEND*/
//CHKSM=B34A4487775C14BEB0A7006D7485A8E47BE414F2